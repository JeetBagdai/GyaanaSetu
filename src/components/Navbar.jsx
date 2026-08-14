import { Menu, LogOut, UserCircle, Bell } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { getAnnouncements } from '../services/api'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

function getInitials(name = '') {
  return name
    .replace(/^(Dr\.|Mrs\.|Mr\.|Ms\.|Prof\.)\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('')
}

export default function Navbar({ onMenuClick }) {
  const { profile, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    async function fetchAnnouncements() {
      if (profile) {
        try {
          const classId = profile.classId || 'default'
          const data = await getAnnouncements(classId)
          // Filter out announcements that don't match this student's class or semester, unless they are admin/teacher.
          let filtered = data
          if (profile.role === 'student') {
            const studentSem = profile.semester || classId.replace('AIML-SEM', '').split('-')[0] || '5'
            filtered = data.filter(a => 
              a.classId === classId || 
              a.classId === `SEM${studentSem}` || 
              a.classId === 'College' || 
              a.classId === 'All' || 
              (a.semester === parseInt(studentSem) && a.classId === 'All')
            )
          }
          setAnnouncements(filtered)
        } catch (err) {
          console.error('Failed to fetch announcements:', err)
        }
      }
    }
    fetchAnnouncements()
  }, [profile])



  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isAdmin   = profile?.role === 'admin'
  const isStudent = profile?.role === 'student'
  const showAvatar = !isAdmin  // teachers + students get avatar
  const onProfile  = location.pathname === '/profile'

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="navbar-greeting">
          <span className="greeting-text">{getGreeting()},</span>
          <span className="greeting-name">
            {isAdmin ? 'Admin' : profile?.name || 'Welcome'}
          </span>
        </div>
      </div>

      <div className="navbar-right">
        <ThemeToggle />

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              if (location.pathname !== '/') {
                navigate('/')
              }
              setTimeout(() => {
                const el = document.getElementById('announcements-section')
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 100)
            }}
            title="View Announcements"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%',
              border: 'none', background: 'transparent',
              color: 'var(--text-secondary)', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Bell size={20} />
            {announcements.length > 0 && (
              <div style={{
                position: 'absolute', top: 6, right: 6, width: 8, height: 8,
                background: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-card)'
              }} />
            )}
          </button>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.85rem', borderRadius: '20px',
            border: '1px solid var(--border)', background: 'var(--bg-input)',
            color: 'var(--text-secondary)', fontSize: '0.82rem',
            fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#fee2e2'
            e.currentTarget.style.color = '#ef4444'
            e.currentTarget.style.borderColor = '#ef444444'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-input)'
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          <LogOut size={14} />
          <span className="logout-text" style={{ display: 'inline-block' }}>Logout</span>
        </button>

        {/* Avatar / profile button for teachers & students */}
        {showAvatar && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => navigate('/profile')}
              title="My Profile"
              style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none',
                background: onProfile
                  ? 'linear-gradient(135deg, var(--primary-hover), var(--primary))'
                  : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                color: '#fff',
                fontWeight: 700, fontSize: '0.78rem', letterSpacing: '-0.5px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: onProfile ? '0 0 0 3px rgba(247,127,50,0.3)' : 'none',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(247,127,50,0.3)'
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--primary-hover), var(--primary))'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = onProfile ? '0 0 0 3px rgba(247,127,50,0.3)' : 'none'
                e.currentTarget.style.background = onProfile
                  ? 'linear-gradient(135deg, var(--primary-hover), var(--primary))'
                  : 'linear-gradient(135deg, var(--primary), var(--primary-hover))'
              }}
            >
              {getInitials(profile?.name) || <UserCircle size={18} />}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
