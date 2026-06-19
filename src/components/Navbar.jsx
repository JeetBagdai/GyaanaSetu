// src/components/Navbar.jsx
import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import './Navbar.css'

export default function Navbar({ onMenuClick }) {
  const { t } = useTranslation()
  const { profile } = useAuth()

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return t('good_morning')
    if (h < 17) return t('good_afternoon')
    return t('good_evening')
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="navbar-greeting">
          <span className="greeting-text">{getGreeting()},</span>
          <span className="greeting-name">{profile?.name?.split(' ')[0] || t('student', 'Student')} 👋</span>
        </div>
      </div>

      <div className="navbar-right">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
