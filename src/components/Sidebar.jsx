// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, BookOpen, ClipboardCheck,
  Calendar, MessageCircle,
  LogOut, GraduationCap
} from 'lucide-react'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/dashboard',  key: 'dashboard',  icon: LayoutDashboard, color: '#7c5cbf' },
  { to: '/learning',   key: 'learning',   icon: BookOpen,         color: '#7c5cbf' },
  { to: '/attendance', key: 'attendance', icon: ClipboardCheck,   color: '#3aafa9' },
  { to: '/timetable',  key: 'timetable',  icon: Calendar,         color: '#f59e0b' },
  { to: '/chatbot',    key: 'chatbot',    icon: MessageCircle,    color: '#52b788' },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <GraduationCap size={22} color="white" />
        </div>
        <div className="logo-text">
          <span className="logo-name">GyaanaSetu</span>
        </div>
      </div>

      {/* User chip */}
      {profile && (
        <div className="sidebar-user">
          <div className="user-avatar">{profile.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className="user-info">
            <span className="user-name">{profile.name}</span>
            <span className="user-role badge badge-purple">{t(profile.role)}</span>
          </div>
        </div>
      )}

      <div className="divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.filter(item => {
          if (profile?.role === 'teacher') {
            return item.key === 'dashboard' || item.key === 'attendance' || item.key === 'timetable';
          }
          return true; // students see everything
        }).map(({ to, key, icon: Icon, color }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? { '--item-color': color } : {}}
          >
            <span className="sidebar-item-icon">
              <Icon size={18} />
            </span>
            <span className="sidebar-item-label">{t(key)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  )
}
