import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db, storage } from '../firebase'
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ExternalLink, Loader2, Search } from 'lucide-react'
import './Certificates.css'

export default function Certificates() {
  const { profile } = useAuth()
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin'
  
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Student form state
  const [title, setTitle] = useState('')
  const [type, setType] = useState('participation')
  const [date, setDate] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Teacher filter state
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCertificates = async () => {
    setLoading(true)
    try {
      let q
      if (isTeacher) {
        q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'))
      } else {
        q = query(collection(db, 'certificates'), where('uid', '==', profile.uid), orderBy('createdAt', 'desc'))
      }
      
      const snap = await getDocs(q)
      const data = []
      snap.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() })
      })
      setCertificates(data)
    } catch (err) {
      console.error('Error fetching certificates:', err)
      // If index is missing, we might get an error due to orderBy. 
      // Let's fallback to no order if it fails (often happens with new composite queries)
      try {
        let q2 = isTeacher 
          ? query(collection(db, 'certificates')) 
          : query(collection(db, 'certificates'), where('uid', '==', profile.uid))
        const snap2 = await getDocs(q2)
        const data2 = []
        snap2.forEach(doc => data2.push({ id: doc.id, ...doc.data() }))
        // manual sort
        data2.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
        setCertificates(data2)
      } catch (err2) {
        console.error('Fallback fetch failed:', err2)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile) fetchCertificates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, isTeacher])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title || !date) {
      setUploadError('Please fill all fields and select a file.')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be under 5MB.')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const ext = file.name.split('.').pop()
      const fileName = `certificates/${profile.uid}_${Date.now()}.${ext}`
      const storageRef = ref(storage, fileName)
      
      await uploadBytes(storageRef, file)
      const fileUrl = await getDownloadURL(storageRef)

      await addDoc(collection(db, 'certificates'), {
        uid: profile.uid,
        studentName: profile.name,
        studentUsn: profile.usn || '',
        title,
        type,
        date,
        fileUrl,
        createdAt: serverTimestamp()
      })

      // Reset form
      setTitle('')
      setType('participation')
      setDate('')
      setFile(null)
      e.target.reset()
      
      // Refresh list
      fetchCertificates()
    } catch (err) {
      console.error('Upload failed:', err)
      setUploadError('Failed to upload certificate. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const filteredCertificates = certificates.filter(c => {
    if (!isTeacher) return true
    const term = searchTerm.toLowerCase()
    return (
      c.studentName?.toLowerCase().includes(term) ||
      c.studentUsn?.toLowerCase().includes(term) ||
      c.title?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="certificates-page">
      <header className="page-header">
        <h1 className="page-title">Certificates & Achievements</h1>
        <p className="page-subtitle">
          {isTeacher ? 'Review student participation and achievements across the campus.' : 'Track your extracurricular participation and showcase your achievements.'}
        </p>
      </header>

      {!isTeacher && (
        <section className="upload-card">
          <h3>Add New Record</h3>
          <form className="upload-form" onSubmit={handleUpload}>
            <div className="form-group full-width">
              <label>Event / Certificate Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. National Hackathon 2026, React Workshop" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Record Type</label>
              <select value={type} onChange={e => setType(e.target.value)} required>
                <option value="participation">Participation</option>
                <option value="achievement">Achievement / Winner</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Date of Event</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group full-width">
              <label>Certificate File (PDF or Image, max 5MB)</label>
              <input 
                type="file" 
                accept=".pdf,image/*" 
                onChange={e => setFile(e.target.files[0])} 
                required 
              />
            </div>
            
            {uploadError && <div style={{ color: '#ef4444', fontSize: '0.9rem', gridColumn: 'span 2' }}>{uploadError}</div>}
            
            <div className="form-group full-width">
              <button type="submit" className="submit-btn" disabled={uploading}>
                {uploading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 size={16} className="spin" /> Uploading...
                  </span>
                ) : 'Upload Certificate'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            {isTeacher ? 'All Student Records' : 'My Uploaded Records'}
          </h3>
        </div>

        {isTeacher && (
          <div className="teacher-filters">
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by student name, USN, or title..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>
        )}

        <div className="certificates-table-container">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
          ) : filteredCertificates.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No records found.
            </div>
          ) : (
            <table className="certificates-table">
              <thead>
                <tr>
                  {isTeacher && <th>Student</th>}
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map(c => (
                  <tr key={c.id}>
                    {isTeacher && (
                      <td>
                        <div style={{ fontWeight: 600 }}>{c.studentName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.studentUsn || 'N/A'}</div>
                      </td>
                    )}
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>
                      <span className={`type-badge ${c.type}`}>
                        {c.type === 'participation' ? 'Participation' : 'Achievement'}
                      </span>
                    </td>
                    <td>{new Date(c.date).toLocaleDateString()}</td>
                    <td>
                      <a href={c.fileUrl} target="_blank" rel="noreferrer" className="view-link">
                        View <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
