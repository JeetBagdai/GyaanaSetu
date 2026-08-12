import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../services/auth'
import { getTeacherPerformanceStats } from '../services/api'
import { BarChart3, Search, TrendingUp, TrendingDown, BookOpen, User, Loader, X, CheckCircle } from 'lucide-react'

export default function TeacherPerformance() {
  const { profile } = useAuth()
  
  const [availableClasses, setAvailableClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)

  // 1. Parse teacher's assigned subjects to get available classes & sections
  useEffect(() => {
    if (profile?.role === 'teacher' && profile?.subjects) {
      const subjectStrings = profile.subjects.split(',').map(s => s.trim())
      const options = []
      const sections = ['A', 'B', 'C', 'D']
      
      subjectStrings.forEach(s => {
        const match = s.match(/(.+)\s*\(Sem\s*(\d+)\)/i)
        if (match) {
          const subject = match[1].trim()
          const semNum = parseInt(match[2], 10)
          if (semNum >= 3) {
            sections.forEach(sec => {
              options.push({
                id: `AIML-SEM${semNum}-${sec}|${subject}`, // compound ID
                classId: `AIML-SEM${semNum}-${sec}`,
                subject: subject,
                label: `${subject} (Sem ${semNum}) - Section ${sec}`
              })
            })
          }
        }
      })
      
      setAvailableClasses(options)
      if (options.length > 0) {
        setSelectedClass(options[0].id)
      }
    }
  }, [profile])

  // 2. Fetch data for selected class and subject
  useEffect(() => {
    async function loadData() {
      if (!selectedClass) return
      setLoading(true)
      try {
        const [classId, subject] = selectedClass.split('|')
        const token = await getToken()
        const data = await getTeacherPerformanceStats(classId, subject, token)
        setStats(data)
      } catch (err) {
        console.error('Failed to load performance stats', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedClass])

  if (profile?.role !== 'teacher') {
    return (
      <div className="fade-in" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>This page is only accessible to Faculty.</p>
      </div>
    )
  }

  const students = stats?.studentPerformance || []
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.usn && s.usn.toLowerCase().includes(search.toLowerCase()))
  )

  const isPracticalClass = filteredStudents.length > 0 && filteredStudents[0].isPractical;

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div style={{ padding: '0.5rem', background: 'var(--color-orange-soft)', color: 'var(--color-orange)', borderRadius: '0.5rem' }}>
            <BarChart3 size={24} />
          </div>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Student Performance</h1>
        </div>
        <p className="page-subtitle" style={{ marginLeft: '3.25rem' }}>Analyze quiz scores and track weak topics across your classes.</p>
      </motion.div>

      {availableClasses.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <BookOpen size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <h3>No Subjects Assigned</h3>
          <p>You don't have any classes assigned to you yet.</p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Select Class:</label>
              <select 
                className="input" 
                value={selectedClass} 
                onChange={e => setSelectedClass(e.target.value)}
                style={{ width: '100%' }}
              >
                {availableClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            
            <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Search students..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
                <Loader size={32} className="spin-anim" />
                <p>Loading performance data...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <User size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                <h3>No Data Available</h3>
                <p>No student performance data found for this class.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Student Name</th>
                      <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Modules Completed</th>
                      <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Avg Quiz Score</th>
                      <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Weak Topics Identified</th>
                      {isPracticalClass && (
                        <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>CodeIT Progress</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, idx) => (
                      <tr 
                        key={student.id || idx} 
                        style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ 
                            width: 32, height: 32, borderRadius: '50%', 
                            background: 'var(--color-orange-soft)', color: 'var(--color-orange)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 600, fontSize: '0.85rem', flexShrink: 0
                          }}>
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{student.name}</div>
                            {student.usn && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.usn}</div>}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{ fontWeight: 600 }}>{student.chaptersRead}</span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '1rem', 
                                        background: student.score >= 75 ? 'rgba(34,197,94,0.1)' : student.score >= 50 ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                                        color: student.score >= 75 ? '#16a34a' : student.score >= 50 ? '#ca8a04' : '#dc2626',
                                        fontWeight: 600, fontSize: '0.85rem' }}>
                            {student.score >= 75 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {student.score}%
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {student.weakTopics && student.weakTopics.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              {student.weakTopics.map((topic, i) => (
                                <span key={i} style={{ 
                                  fontSize: '0.75rem', padding: '0.2rem 0.5rem', 
                                  background: 'var(--surface)', border: '1px solid var(--border)',
                                  borderRadius: '0.25rem', color: 'var(--text-secondary)' 
                                }}>
                                  {topic}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None identified</span>
                          )}
                        </td>
                        {isPracticalClass && (
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                              {student.codeItPercent}%
                              {student.codeItPercent === 100 && <CheckCircle size={14} color="#16a34a" />}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setSelectedStudent(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="card"
              style={{ position: 'relative', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
            >
              <button 
                onClick={() => setSelectedStudent(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--surface)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: '50%', 
                  background: 'var(--color-orange-soft)', color: 'var(--color-orange)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.5rem'
                }}>
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selectedStudent.name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>USN: {selectedStudent.usn || 'N/A'}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Modules Completed</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{selectedStudent.chaptersRead}</div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Avg Quiz Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: selectedStudent.score >= 75 ? '#16a34a' : selectedStudent.score >= 50 ? '#ca8a04' : '#dc2626' }}>{selectedStudent.score}%</div>
                </div>
                {selectedStudent.isPractical && (
                  <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CodeIT Progress</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>{selectedStudent.codeItPercent}%</div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Top Weak Topics</h3>
                {selectedStudent.weakTopics && selectedStudent.weakTopics.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedStudent.weakTopics.map((t, i) => (
                      <li key={i} style={{ padding: '0.75rem 1rem', background: 'var(--surface)', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-orange)' }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No weak topics identified yet.</p>
                )}
              </div>

              {selectedStudent.quizzes && selectedStudent.quizzes.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Quiz Scores</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedStudent.quizzes.slice(0, 5).map((q, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--surface)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{q.chapter}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: q.scorePercent >= 75 ? '#16a34a' : q.scorePercent >= 50 ? '#ca8a04' : '#dc2626' }}>{q.scorePercent}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
