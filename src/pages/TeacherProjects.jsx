import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, query, where, onSnapshot, doc, setDoc, getDocs } from 'firebase/firestore'
import { SEMESTERS, getProjectSubjects, getTheorySubjects, getPracticalSubjects } from '../data/learningContent'
import { FolderGit2, Settings, Link as LinkIcon, FileText, CheckCircle, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import './Dashboard.css'

export default function TeacherProjects() {
  const { profile } = useAuth()
  
  const [selectedSem, setSelectedSem] = useState('5')
  const [projectSettings, setProjectSettings] = useState({})
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  // Get subjects for selected semester
  const prjSubjects = getProjectSubjects(Number(selectedSem))
  const theorySubjects = getTheorySubjects(Number(selectedSem))
  const labSubjects = getPracticalSubjects(Number(selectedSem))
  
  // Parse teacher's subjects
  const teacherAssignedSubjects = (profile?.subjects || '').split(',').filter(Boolean).map(s => {
    const match = s.trim().match(/(.+)\s*\(Sem\s*(\d+)\)/i)
    if (match) return match[1].trim()
    return s.trim()
  })

  // Only include subjects for this semester that are assigned to this teacher
  const allSubjects = [...new Set([...prjSubjects, ...theorySubjects, ...labSubjects])]
  const mySubjects = profile?.role === 'admin' ? allSubjects : allSubjects.filter(sub => 
    teacherAssignedSubjects.some(assigned => assigned.toLowerCase() === sub.toLowerCase() || assigned.includes(sub) || sub.includes(assigned))
  )

  useEffect(() => {
    // Fetch project settings
    const qSettings = query(collection(db, 'project_settings'), where('semester', '==', Number(selectedSem)))
    const unsubSettings = onSnapshot(qSettings, (snap) => {
      const settingsMap = {}
      snap.forEach(doc => {
        settingsMap[doc.data().subject] = { id: doc.id, enabled: doc.data().enabled }
      })
      setProjectSettings(settingsMap)
    })

    // Fetch submissions
    const qSubs = query(collection(db, 'project_submissions'), where('semester', '==', Number(selectedSem)))
    const unsubSubs = onSnapshot(qSubs, (snap) => {
      const subs = []
      snap.forEach(doc => {
        subs.push({ id: doc.id, ...doc.data() })
      })
      // Sort by submitted at, newest first
      subs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      setSubmissions(subs)
      setLoading(false)
    })

    return () => {
      unsubSettings()
      unsubSubs()
    }
  }, [selectedSem])

  const toggleSubject = async (subject, currentState) => {
    try {
      const docId = `${selectedSem}_${subject.replace(/[^a-zA-Z0-9]/g, '')}`
      await setDoc(doc(db, 'project_settings', docId), {
        semester: Number(selectedSem),
        subject,
        enabled: !currentState,
        updatedAt: new Date().toISOString(),
        updatedBy: profile?.name || 'Unknown Teacher'
      })
    } catch (err) {
      console.error(err)
      alert('Failed to update settings')
    }
  }

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Submissions</h1>
          <p className="page-subtitle">Manage project requirements and view student submissions</p>
        </div>
        <div>
          <select className="form-input" value={selectedSem} onChange={e => setSelectedSem(e.target.value)} style={{ padding: '0.5rem', width: '200px' }}>
            {SEMESTERS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} /> Project Settings
          </h2>
          <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>
            Toggle which subjects require project submissions. Pure project subjects (PRJ) are always enabled.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {mySubjects.map(subject => {
              const isPrj = prjSubjects.includes(subject)
              const isEnabled = isPrj || projectSettings[subject]?.enabled
              
              return (
                <div key={subject} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-app)', borderRadius: '8px', borderLeft: isPrj ? '4px solid var(--color-purple)' : '4px solid transparent' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{subject}</div>
                    {isPrj && <div style={{ fontSize: '0.75rem', color: 'var(--color-purple)', marginTop: '0.2rem' }}>Default Enabled</div>}
                  </div>
                  <label className="switch" style={{ opacity: isPrj ? 0.5 : 1, pointerEvents: isPrj ? 'none' : 'auto' }}>
                    <input 
                      type="checkbox" 
                      checked={isEnabled || false} 
                      onChange={() => toggleSubject(subject, isEnabled)} 
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              )
            })}
            {mySubjects.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                You do not have any subjects assigned for Semester {selectedSem}.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Student Submissions</h2>
        
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FolderGit2 size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p>No project submissions yet for Semester {selectedSem}</p>
          </div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Student</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subject</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Links</th>
                  <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--background)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{sub.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.studentUSN}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', maxWidth: '300px' }}>
                      {sub.subject}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {sub.githubLink && (
                          <a href={sub.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-blue)' }}>
                            <LinkIcon size={14} style={{ marginRight: '4px' }} /> GitHub
                          </a>
                        )}
                        {sub.reportLink && (
                          <a href={sub.reportLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--color-purple)' }}>
                            <FileText size={14} style={{ marginRight: '4px' }} /> Report
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
