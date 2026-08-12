import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, query, where, onSnapshot, doc, setDoc, getDocs, addDoc } from 'firebase/firestore'
import { SEMESTERS, getProjectSubjects, getPracticalSubjects, getTheorySubjects } from '../data/learningContent'
import { FolderGit2, UploadCloud, Link as LinkIcon, CheckCircle, FileText, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import './Dashboard.css' // Reuse cards CSS

export default function Projects() {
  const { profile, user } = useAuth()
  const studentSem = Number(profile?.semester) || 5
  
  const [projectSettings, setProjectSettings] = useState({})
  const [submissions, setSubmissions] = useState({})
  const [loading, setLoading] = useState(true)

  // Submissions form state
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [githubLink, setGithubLink] = useState('')
  const [reportLink, setReportLink] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Get all subjects for this semester
  const prjSubjects = getProjectSubjects(studentSem)
  const theorySubjects = getTheorySubjects(studentSem)
  const labSubjects = getPracticalSubjects(studentSem)
  const allSubjects = [...new Set([...prjSubjects, ...theorySubjects, ...labSubjects])]

  useEffect(() => {
    if (!user) return

    // Listen to project settings to see which subjects are enabled
    const qSettings = query(collection(db, 'project_settings'), where('semester', '==', studentSem))
    const unsubSettings = onSnapshot(qSettings, (snap) => {
      const settingsMap = {}
      snap.forEach(doc => {
        settingsMap[doc.data().subject] = doc.data().enabled
      })
      setProjectSettings(settingsMap)
    })

    // Listen to student submissions
    const qSubs = query(collection(db, 'project_submissions'), where('studentUSN', '==', profile?.usn || user.uid))
    const unsubSubs = onSnapshot(qSubs, (snap) => {
      const subMap = {}
      snap.forEach(doc => {
        subMap[doc.data().subject] = { id: doc.id, ...doc.data() }
      })
      setSubmissions(subMap)
      setLoading(false)
    })

    return () => {
      unsubSettings()
      unsubSubs()
    }
  }, [studentSem, user, profile?.usn])

  // Determine enabled subjects
  const enabledSubjects = allSubjects.filter(sub => {
    // PRJ subjects are enabled by default
    if (prjSubjects.includes(sub)) return true
    // Otherwise check if teacher enabled it
    return projectSettings[sub] === true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!githubLink && !reportLink) return alert('Please provide at least a GitHub link or Report link.')
    
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'project_submissions'), {
        studentUSN: profile?.usn || user.uid,
        studentName: profile?.name,
        semester: studentSem,
        subject: selectedSubject,
        githubLink,
        reportLink,
        submittedAt: new Date().toISOString()
      })
      setSelectedSubject(null)
      setGithubLink('')
      setReportLink('')
      alert('Project submitted successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to submit project.')
    } finally {
      setSubmitting(false)
    }
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  if (loading) {
    return <div className="page-inner"><div style={{ padding: '3rem', textAlign: 'center' }}>Loading projects...</div></div>
  }

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects Hub</h1>
          <p className="page-subtitle">Submit your project assignments and reports for Semester {studentSem}</p>
        </div>
      </div>

      {enabledSubjects.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FolderGit2 size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <h3>No Projects Enabled</h3>
          <p>Your teachers have not enabled project submissions for any subjects in Semester {studentSem} yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
          {enabledSubjects.map(subject => {
            const isPrj = prjSubjects.includes(subject)
            const submission = submissions[subject]

            return (
              <motion.div key={subject} className="card" variants={item} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: isPrj ? '4px solid var(--color-purple)' : '4px solid var(--color-blue)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{subject}</h3>
                    {isPrj && <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Project Subject</span>}
                  </div>
                </div>

                {submission ? (
                  <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: '8px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 500, marginBottom: '1rem' }}>
                      <CheckCircle size={18} />
                      Submitted Successfully
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                      {submission.githubLink && (
                        <a href={submission.githubLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-blue)' }}>
                          <LinkIcon size={14} /> View GitHub Repository
                        </a>
                      )}
                      {submission.reportLink && (
                        <a href={submission.reportLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-purple)' }}>
                          <FileText size={14} /> View Project Report
                        </a>
                      )}
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        Submitted on {new Date(submission.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 'auto' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                      onClick={() => setSelectedSubject(subject)}
                    >
                      <UploadCloud size={16} /> Submit Project
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Submission Modal */}
      {selectedSubject && (
        <div className="modal-backdrop" onClick={() => !submitting && setSelectedSubject(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <motion.div 
            className="card" 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}
          >
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Submit Project</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Submitting for: <strong>{selectedSubject}</strong>
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">GitHub Repository URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://github.com/username/repo"
                  value={githubLink}
                  onChange={e => setGithubLink(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Project Report URL (Drive, PDF, etc)</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://docs.google.com/..."
                  value={reportLink}
                  onChange={e => setReportLink(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setSelectedSubject(null)} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting || (!githubLink && !reportLink)}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
