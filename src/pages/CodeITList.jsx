import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { Code2, ChevronRight, Lock, CheckCircle, Clock } from 'lucide-react'
import './Dashboard.css' // Reuse the same CSS for grid and cards

import { getPracticalSubjects } from '../data/learningContent'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }

export default function CodeITList() {
  const { profile, user } = useAuth()
  const navigate = useNavigate()
  
  const [problems, setProblems] = useState([])
  const [submissions, setSubmissions] = useState({})
  const [loading, setLoading] = useState(true)

  const studentSem = Number(profile?.semester) || 5

  useEffect(() => {
    if (!user) return

    // Listen to problems for the student's semester
    const qProblems = query(
      collection(db, 'coding_problems'),
      where('semester', '==', studentSem)
    )
    
    const unsubProblems = onSnapshot(qProblems, (snap) => {
      const pData = []
      snap.forEach(doc => pData.push({ id: doc.id, ...doc.data() }))
      setProblems(pData)
      setLoading(false)
    })

    // Listen to submissions for this student
    const qSubs = query(
      collection(db, 'submissions'),
      where('studentUSN', '==', profile?.usn || user.uid)
    )
    
    const unsubSubs = onSnapshot(qSubs, (snap) => {
      const sMap = {}
      snap.forEach(doc => {
        const data = doc.data()
        // If multiple submissions exist, keep the best/latest (simplified to just last one for now)
        sMap[data.problemId] = data
      })
      setSubmissions(sMap)
    })

    return () => {
      unsubProblems()
      unsubSubs()
    }
  }, [studentSem, user, profile?.usn])

  // Group problems by subject
  const groupedProblems = problems.reduce((acc, prob) => {
    const subj = prob.subject || prob.subjectCode || 'General'
    if (!acc[subj]) acc[subj] = []
    acc[subj].push(prob)
    return acc
  }, {})

  const practicalSubjects = getPracticalSubjects(studentSem)


  const getSubjectStats = (probs) => {
    const total = probs.length
    const completed = probs.filter(p => submissions[p.id]?.status === 'completed').length
    const inProgress = probs.filter(p => submissions[p.id]?.status !== 'completed' && submissions[p.id]).length
    return { total, completed, inProgress }
  }

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">CodeIT Practice Module</h1>
          <p className="page-subtitle">Master your programming skills with interactive, semester-aligned coding challenges.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading challenges...</div>
      ) : practicalSubjects.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Code2 size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <h3>No Practical Subjects Found</h3>
          <p>There are no CodeIT challenges assigned for Semester {studentSem}.</p>
        </div>
      ) : (
        <motion.div className="dashboard-grid" variants={container} initial="hidden" animate="show" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {practicalSubjects.map((subjectTitle) => {
            const probs = groupedProblems[subjectTitle] || []
            const { total, completed, inProgress } = getSubjectStats(probs)
            // Expect 30 problems minimum per syllabus rule
            const expectedTotal = Math.max(total, 30)
            const progressPct = expectedTotal > 0 ? Math.round((completed / expectedTotal) * 100) : 0

            // Group by module
            const moduleGroups = {}
            probs.forEach(p => {
              const m = p.module || 'Module 1'
              if (!moduleGroups[m]) moduleGroups[m] = []
              moduleGroups[m].push(p)
            })
            // Sort modules by name (Module 1, Module 2, etc.)
            const modules = Object.keys(moduleGroups).sort()

            return (
              <motion.div key={subjectTitle} className="card" variants={item} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '4px solid var(--color-orange)' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: '0 0 0.5rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {subjectTitle}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {total} / {expectedTotal} Challenges Available
                  </p>
                </div>
                
                <div style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>Progress</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progressPct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--color-orange)', borderRadius: '3px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} color="#10b981" /> {completed} Completed</span>
                    {inProgress > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} color="#f59e0b" /> {inProgress} In Progress</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                  {modules.length > 0 ? (
                    modules.map(mod => {
                      const modProbs = moduleGroups[mod].sort((a, b) => (a.order || 0) - (b.order || 0))
                      const firstProblem = modProbs[0]
                      return (
                        <button 
                          key={mod}
                          className="btn btn-primary" 
                          onClick={() => firstProblem ? navigate(`/codeit/${firstProblem.id}`) : null}
                          disabled={!firstProblem}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.5rem', background: 'var(--bg-app)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                        >
                          Enter {mod} <ChevronRight size={16} />
                        </button>
                      )
                    })
                  ) : (
                    <button 
                      className="btn btn-primary" 
                      disabled
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.6rem' }}
                    >
                      Generating...
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
