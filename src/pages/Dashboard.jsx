import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../services/auth'
import { getDashboardStats } from '../services/api'
import {
  BookOpen, ClipboardCheck, Calendar,
  Compass, MessageCircle, TrendingUp, Clock
} from 'lucide-react'
import './Dashboard.css'

const QUICK_ACTIONS = [
  { to: '/learning',   label: 'learning',   icon: BookOpen,       color: 'purple', bg: '#ede9fb' },
  { to: '/attendance', label: 'attendance', icon: ClipboardCheck, color: 'teal',   bg: '#e4f7ef' },
  { to: '/timetable',  label: 'timetable',  icon: Calendar,       color: 'gold',   bg: '#fffbeb' },
  { to: '/chatbot',    label: 'chatbot',    icon: MessageCircle,  color: 'green',  bg: '#e4f7ef' },
]

const ACTION_COLORS = {
  purple: { icon: '#7c5cbf', bg: '#ede9fb' },
  teal:   { icon: '#3aafa9', bg: '#e4f7ef' },
  gold:   { icon: '#d97706', bg: '#fffbeb' },
  rose:   { icon: '#e05f7c', bg: '#fdeef3' },
  green:  { icon: '#52b788', bg: '#e4f7ef' },
  lime:   { icon: '#16a34a', bg: '#f0fdf4' },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1,  y: 0 },
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)

  useEffect(() => {
    let interval;
    async function loadStats() {
      try {
        const token = await getToken()
        const data = await getDashboardStats(profile?.role, profile?.classId, token)
        setStats(data)
      } catch (err) {
        console.error('Failed to load dashboard stats', err)
      }
    }
    if (profile) {
      loadStats()
      interval = setInterval(loadStats, 5000) // Poll every 5s for real-time updates
    }
    return () => clearInterval(interval)
  }, [profile])

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const isTeacher = profile?.role === 'teacher'

  return (
    <div className="page-inner">
      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="page-title">
            {isTeacher ? '👩‍🏫' : '🎒'} {t('dashboard')}
          </h1>
          <p className="page-subtitle">{today}</p>
        </div>
        {!isTeacher && profile?.grade && (
          <span className="badge badge-purple" style={{ fontSize: '0.875rem', padding: '0.4rem 1rem' }}>
            {t('grade')} {profile.grade}
          </span>
        )}
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="dashboard-stats"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {isTeacher ? (
          <>
            <motion.div className="stat-card card" variants={item}>
              <div className="stat-icon" style={{ background: '#e4f7ef', color: '#3aafa9' }}>
                <ClipboardCheck size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.studentsPresentToday ?? '—'}</span>
                <span className="stat-label">Students Present Today</span>
              </div>
            </motion.div>
            <motion.div className="stat-card card" variants={item}>
              <div className="stat-icon" style={{ background: '#ede9fb', color: '#7c5cbf' }}>
                <BookOpen size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.totalChaptersRead ?? '—'}</span>
                <span className="stat-label">Total Chapters Read (Class)</span>
              </div>
            </motion.div>
            <motion.div className="stat-card card" variants={item}>
              <div className="stat-icon" style={{ background: '#fdeef3', color: '#e05f7c' }}>
                <TrendingUp size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats?.avgChapters ?? '—'}</span>
                <span className="stat-label">Avg Chapters / Student</span>
              </div>
            </motion.div>
          </>
        ) : (
          [
            { label: t('chapters_read', 'Chapters Read'),      value: stats?.chaptersRead ?? '—',  icon: BookOpen,       color: '#7c5cbf', bg: '#ede9fb' },
            { label: t('attendance', 'Attendance'),         value: stats?.attendanceDays ?? '—', icon: ClipboardCheck, color: '#3aafa9', bg: '#e4f7ef' },
            { label: t('progress_score', 'Progress Score'),     value: stats?.progressScore ?? '—',  icon: TrendingUp,     color: '#e05f7c', bg: '#fdeef3' },
          ].map(stat => (
            <motion.div key={stat.label} className="stat-card card" variants={item}>
              <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                <stat.icon size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="dashboard-grid">
        {/* Quick Actions (Student Only) */}
        {!isTeacher && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="section-title">{t('quick_actions')}</h2>
            <motion.div
              className="actions-grid"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {QUICK_ACTIONS.map(({ to, label, icon: Icon, color }) => {
                const { icon: iconColor, bg } = ACTION_COLORS[color]
                return (
                  <motion.button
                    key={to}
                    className="action-card"
                    variants={item}
                    onClick={() => navigate(to)}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="action-icon" style={{ background: bg, color: iconColor }}>
                      <Icon size={22} />
                    </div>
                    <span className="action-label">{t(label)}</span>
                  </motion.button>
                )
              })}
            </motion.div>
          </motion.div>
        )}

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="section-title">{t('todays_schedule')}</h2>
          <div className="card schedule-card">
            <div className="schedule-empty">
              <Calendar size={36} color="var(--text-muted)" style={{ opacity: 0.5 }} />
              <p className="text-muted text-sm">{t('no_classes_today')}</p>
              {!isTeacher && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate('/timetable')}
                >
                  {t('timetable')} →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ marginTop: '1.5rem' }}
      >
        <h2 className="section-title">
          {isTeacher ? 'Student Performance' : t('recent_progress')}
        </h2>
        {isTeacher ? (
          <div className="card" style={{ padding: '1.5rem' }}>
            {stats?.studentPerformance?.length > 0 ? (
              <div className="student-performance-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.studentPerformance.map((student, idx) => (
                  <div key={student.id} style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="user-avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{student.name}</div>
                          <div className="text-muted text-sm">Chapters Read: {student.chaptersRead}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, color: student.score >= 70 ? '#16a34a' : student.score >= 40 ? '#d97706' : '#ef4444' }}>
                          {student.score}% avg
                        </div>
                      </div>
                    </div>
                    {student.weakTopics && student.weakTopics.length > 0 && (
                      <div style={{ padding: '0.5rem 1rem', background: '#fffbeb', color: '#b45309', fontSize: '0.85rem', borderTop: '1px solid #fde68a' }}>
                        <span style={{ fontWeight: 600 }}>⚠️ Needs review:</span> {student.weakTopics.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <TrendingUp size={36} color="var(--text-muted)" style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
                <p className="text-muted text-sm">Class performance reports will appear here based on student quiz scores and reading habits.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card progress-empty">
            <BookOpen size={36} color="var(--text-muted)" style={{ opacity: 0.5 }} />
            <p className="text-muted text-sm">{t('start_reading', 'Start reading a chapter to see your progress here!')}</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/learning')}
            >
              {t('learning')} →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
