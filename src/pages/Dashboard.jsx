import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../services/auth'
import { getDashboardStats, getAnnouncements, postAnnouncement } from '../services/api'
import {
  Network, FlaskConical, Sigma, Layers,
  BookOpen, ClipboardCheck, Calendar,
  MessageCircle, Brain, Megaphone, Send,
  Cpu, Eye, Database, Cloud, Code2, BarChart3, MapPin,
  FolderGit2, Award, LayoutGrid
} from 'lucide-react'
import './Dashboard.css'

import { SUBJECTS_DATA } from '../data/learningContent'

// Group subjects by semester → { 1: [...], 2: [...], ... }
function groupBySem(subjects) {
  return subjects.reduce((acc, s) => {
    if (!acc[s.sem]) acc[s.sem] = []
    acc[s.sem].push(s)
    return acc
  }, {})
}

const STUDENT_QUICK_ACTIONS = [
  { to: '/learning',   label: 'Learning Resources', icon: BookOpen,       color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
  { to: '/attendance', label: 'Attendance',          icon: ClipboardCheck, color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
  { to: '/codeit',     label: 'CodeIT',              icon: Code2,          color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
  { to: '/chatbot',    label: 'AI Tutor',             icon: Brain,          color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
]

// Base actions every teacher sees
const TEACHER_ACTIONS_NO_MANAGE = [
  { to: '/teacher-projects', label: 'Projects',    icon: FolderGit2, color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
  { to: '/timetable',        label: 'My Schedule', icon: Calendar,   color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
]

// Actions for teachers with timetable manager access
const TEACHER_ACTIONS_WITH_MANAGE = [
  { to: '/teacher-projects', label: 'Projects',    icon: FolderGit2, color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
  { to: '/performance',      label: 'Performance', icon: BarChart3,  color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
  { to: '/timetable',        label: 'My Schedule', icon: Calendar,   color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
  { to: '/timetable-manage', label: 'Manage Timetable', icon: LayoutGrid, color: 'var(--color-orange)', bg: 'var(--color-orange-soft)' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function Dashboard() {
  const { profile } = useAuth()
  const navigate    = useNavigate()
  const isTeacher   = profile?.role === 'teacher'
  const canManage   = isTeacher && profile?.timetableManager === true
  
  const [stats, setStats] = useState({ chaptersRead: 0, attendanceDays: 0, avgQuizScore: 0, streakDays: 0 })
  const [announcements, setAnnouncements] = useState([])
  const [annForm, setAnnForm] = useState({ title: '', message: '', target: 'All' })
  const [postingAnn, setPostingAnn] = useState(false)
  useEffect(() => {
    async function loadStats() {
      try {
        const token = await getToken()
        if (!token) return
        const classId = profile?.classId || 'default'
        const data = await getDashboardStats(profile?.role || 'student', classId, profile.uid)
        if (data) {
          setStats({
            chaptersRead: data.chaptersRead || 0,
            attendanceDays: data.attendanceDays || 0,
            avgQuizScore: data.avgQuizScore || 0,
            streakDays: data.attendanceDays || 0 // Proxying streak as attendance days for MVP
          })
        }
      } catch (err) {
        console.error('Failed to load stats:', err)
      }
    }
    loadStats()

    async function loadAnnouncements() {
      if (!isTeacher && profile) {
        try {
          const classId = profile.classId || 'default'
          const data = await getAnnouncements(classId)
          const studentSem = profile.semester || classId.replace('AIML-SEM', '') || '5'
          const filtered = data.filter(a => a.classId === classId || a.classId === 'All' || a.semester === parseInt(studentSem))
          setAnnouncements(filtered)
        } catch (err) {
          console.error(err)
        }
      }
    }
    loadAnnouncements()
  }, [profile, isTeacher])

  const teacherActions = canManage ? TEACHER_ACTIONS_WITH_MANAGE : TEACHER_ACTIONS_NO_MANAGE

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  // Dynamically get student subjects based on their profile semester
  const studentSemNum = parseInt(profile?.semester || profile?.classId?.replace('AIML-SEM', '') || '5')
  const studentSubjectsList = SUBJECTS_DATA.filter(s => s.sem === studentSemNum)
  
  const STUDENT_SUBJECTS = studentSubjectsList.map(subj => ({
    code: subj.code,
    name: subj.title,
    sem: studentSemNum,
    icon: BookOpen,
    color: 'var(--color-orange)',
    bg: 'var(--color-orange-soft)'
  }))

  const TEACHER_SUBJECTS = isTeacher ? (profile?.subjects || '').split(',').filter(Boolean).map((s, i) => {
    const match = s.trim().match(/(.+)\s*\(Sem\s*(\d+)\)/i)
    if (match) {
      return {
        code: `S${match[2]}-${i+1}`,
        name: match[1].trim(),
        sem: Number(match[2]),
        icon: BookOpen,
        color: 'var(--color-orange)',
        bg: 'var(--color-orange-soft)'
      }
    }
    return {
      code: `Subj-${i+1}`,
      name: s.trim(),
      sem: 0,
      icon: BookOpen,
      color: 'var(--color-orange)',
      bg: 'var(--color-orange-soft)'
    }
  }).filter(subj => subj.sem === 0 || subj.sem >= 3).sort((a, b) => a.sem - b.sem) : []

  return (
    <div className="page-inner">
      {/* ── Header ── */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">{today}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            {isTeacher ? (
            <>
              <span className="badge badge-teal" style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}>
                AIML Department
              </span>
            </>
          ) : (
            <>
              <span className="badge badge-orange" style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}>
                AIML • Semester {studentSemNum}
              </span>
              <span className="badge" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                USN: {profile?.usn || '—'}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* ── Main content grid ── */}
      <div className="dashboard-grid">
        {/* ── Quick Actions ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="section-title">Quick Actions</h2>
          <motion.div className="actions-grid" variants={container} initial="hidden" animate="show">
            {(isTeacher ? teacherActions : STUDENT_QUICK_ACTIONS).map(({ to, label, icon: Icon, color, bg }) => (
              <motion.button
                key={to}
                className="action-card"
                variants={item}
                onClick={() => navigate(to)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="action-icon" style={{ background: bg, color }}>
                  <Icon size={22} />
                </div>
                <span className="action-label">{label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Subjects ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="section-title">
            {isTeacher ? 'Subjects You Teach' : `Semester ${studentSemNum} Subjects`}
          </h2>

          {isTeacher ? (
            TEACHER_SUBJECTS.length === 0 ? (
              <div className="text-muted" style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-card)' }}>No subjects assigned yet.</div>
            ) : (
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {TEACHER_SUBJECTS.map(subj => {
                    const Icon = subj.icon
                    return (
                      <div
                        key={subj.code}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', borderRadius: 0, background: subj.bg, border: `1px solid ${subj.color}22` }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Icon size={16} color={subj.color} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: subj.color, background: `${subj.color}15`, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                              {(() => {
                                const classMatch = profile?.classId?.match(/SEM(\d+)(?:-([A-Z]))?/);
                                if (classMatch) {
                                  return `Sem ${classMatch[1]}${classMatch[2] ? ` - ${classMatch[2]}` : ''}`;
                                }
                                return `Sem ${subj.sem}`;
                              })()}
                            </span>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {subj.name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          ) : (
            /* ── Student: flat Sem 5 grid ── */
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {STUDENT_SUBJECTS.map(subj => {
                  const Icon = subj.icon
                  return (
                    <div
                      key={subj.code}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 0, background: subj.bg, border: `1px solid ${subj.color}22` }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 0, background: subj.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color={subj.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: subj.color }}>{subj.code}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{subj.name}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Teacher Quick Announcement Board (MOVED OUTSIDE GRID) ── */}
      {isTeacher && TEACHER_SUBJECTS.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Megaphone size={18} color="var(--color-orange)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Quick Announcement</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input 
                type="text" 
                placeholder="Announcement Title" 
                className="input-field" 
                value={annForm.title} 
                onChange={e => setAnnForm({...annForm, title: e.target.value})}
              />
              <textarea 
                placeholder="What do you want to announce to your students?" 
                className="input-field" 
                rows={3} 
                style={{ resize: 'vertical' }}
                value={annForm.message}
                onChange={e => setAnnForm({...annForm, message: e.target.value})}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <select 
                  className="input-field" 
                  style={{ flex: 1, padding: '0.6rem' }}
                  value={annForm.target}
                  onChange={e => setAnnForm({...annForm, target: e.target.value})}
                >
                  <option value="All">All My Classes</option>
                  {TEACHER_SUBJECTS.map(s => (
                    <option key={s.code} value={s.sem}>Semester {s.sem}</option>
                  ))}
                </select>
                <button 
                  className="btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
                  disabled={postingAnn || !annForm.title || !annForm.message}
                  onClick={async () => {
                    setPostingAnn(true)
                    try {
                      await postAnnouncement({
                        title: annForm.title,
                        message: annForm.message,
                        authorName: profile.name,
                        classId: annForm.target === 'All' ? 'All' : `AIML-SEM${annForm.target}`,
                        semester: annForm.target === 'All' ? null : parseInt(annForm.target)
                      })
                      setAnnForm({ title: '', message: '', target: 'All' })
                      alert('Announcement posted successfully!')
                    } catch (err) {
                      alert('Failed to post: ' + err.message)
                    }
                    setPostingAnn(false)
                  }}
                >
                  <Send size={16} />
                  {postingAnn ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Performance Analytics ── */}
      {!isTeacher && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: '1.5rem' }}>
          <h2 className="section-title">Performance Analytics</h2>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>

              <div style={{ padding: '1.25rem', background: 'var(--surface)', borderRadius: 0, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="text-muted text-sm" style={{ fontWeight: 600 }}>Overall Accuracy</span>
                  <BarChart3 size={16} color="var(--color-orange)" />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.avgQuizScore}%</div>
                <div style={{ marginTop: '0.5rem', height: '4px', background: 'rgba(247,127,50,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stats.avgQuizScore}%` }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} style={{ height: '100%', background: 'var(--color-orange)' }} />
                </div>
              </div>

              <div style={{ padding: '1.25rem', background: 'var(--surface)', borderRadius: 0, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="text-muted text-sm" style={{ fontWeight: 600 }}>Modules Completed</span>
                  <BookOpen size={16} color="var(--color-orange)" />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.chaptersRead} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {STUDENT_SUBJECTS.length * 5}</span></div>
                <div style={{ marginTop: '0.5rem', height: '4px', background: 'rgba(247,127,50,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.chaptersRead / (STUDENT_SUBJECTS.length * 5)) * 100}%` }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }} style={{ height: '100%', background: 'var(--color-orange)' }} />
                </div>
              </div>

              <div style={{ padding: '1.25rem', background: 'var(--surface)', borderRadius: 0, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="text-muted text-sm" style={{ fontWeight: 600 }}>Active Streak</span>
                  <FlaskConical size={16} color="var(--color-orange)" />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.streakDays} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Days</span></div>
                <div className="text-sm" style={{ marginTop: '0.5rem', color: 'var(--color-orange)', fontWeight: 600, display: 'flex', gap: '0.25rem' }}>
                  {[1,2,3,4,5].map(day => (
                     <motion.div key={day} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + (day * 0.1) }} style={{ height: '4px', flex: 1, background: day <= Math.min(stats.streakDays, 5) ? 'var(--color-orange)' : 'rgba(247,127,50,0.15)', borderRadius: '2px' }} />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}

      {/* ── Student Announcements Feed ── */}
      {!isTeacher && (
        <motion.div id="announcements-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
          <h2 className="section-title">Recent Announcements</h2>
          <div className="card" style={{ padding: '1.5rem' }}>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No recent announcements.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {announcements.map(ann => (
                  <div key={ann.id} style={{ padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', borderLeft: '4px solid var(--color-orange)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ann.title}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ann.timestamp?.seconds ? new Date(ann.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {ann.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Megaphone size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>{ann.authorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
