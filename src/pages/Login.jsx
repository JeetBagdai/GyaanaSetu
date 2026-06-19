// src/pages/Login.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Mail, Lock, User, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LanguageSwitcher from '../components/LanguageSwitcher'
import ThemeToggle from '../components/ThemeToggle'
import './Login.css'

const GRADES = ['IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export default function Login() {
  const { t } = useTranslation()
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]       = useState('login')   // 'login' | 'register'
  const [role, setRole]       = useState('student')
  const [grade, setGrade]     = useState('VI')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, name, role, role === 'student' ? grade : null)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Dynamic Background */}
      <div className="premium-bg">
        <div 
          className="bg-glow" 
          style={{ 
            left: `${mousePosition.x}px`, 
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)'
          }} 
        />
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        <div className="bg-shape shape-3" />
        <div className="bg-grid-overlay" />
      </div>

      {/* Top Bar */}
      <motion.div 
        className="premium-topbar"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="premium-logo">
          <div className="premium-logo-icon">
            <GraduationCap size={20} />
          </div>
          <span>GyaanaSetu</span>
        </div>
        <div className="topbar-actions">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </motion.div>

      <div className="premium-container">
        {/* Left Side: Brand Story */}
        <motion.div 
          className="premium-hero"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-content">
            <motion.div 
              className="badge-pill"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles size={14} className="sparkle-icon" />
              <span>{t('next_gen_education', 'Next-Gen Education')}</span>
            </motion.div>
            
            <h1 className="hero-title">
              {t('empower_your', 'Empower Your ')} <br/>
              <span className="text-gradient">{t('learning_journey', 'Learning Journey')}</span>
            </h1>
            
            <p className="hero-subtitle">
              {t('hero_subtitle', 'Experience the future of education with AI-driven insights, interactive NCERT libraries, and smart gamification.')}
            </p>

            <div className="feature-grid">
              {[
                { icon: '📚', text: t('feature_library', 'Interactive Library') },
                { icon: '🤖', text: t('feature_ai', 'AI Tutor Assistant') },
              ].map((f, i) => (
                <motion.div 
                  key={i} 
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                >
                  <span className="feature-icon">{f.icon}</span>
                  <span className="feature-text">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Auth Card */}
        <motion.div 
          className="premium-auth-wrapper"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <div className="premium-card">
            {/* Mode Switcher */}
            <div className="mode-switcher">
              <button
                className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); }}
              >
                {t('sign_in', 'Sign In')}
              </button>
              <button
                className={`mode-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setError(''); }}
              >
                {t('register', 'Create Account')}
              </button>
              <div 
                className="mode-indicator" 
                style={{ transform: `translateX(${mode === 'login' ? '0%' : '100%'})` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                className="premium-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="form-header">
                  <h2>{mode === 'login' ? t('welcome_back', 'Welcome Back') : t('register', 'Join GyaanaSetu')}</h2>
                  <p>{mode === 'login' ? t('sign_in', 'Enter your credentials to access your account') : t('create_account_desc', 'Start your personalized learning experience today')}</p>
                </div>

                {/* Registration Fields */}
                {mode === 'register' && (
                  <motion.div 
                    className="register-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="premium-input-group">
                      <label>{t('name', 'Full Name')}</label>
                      <div className="input-container">
                        <User size={18} className="icon" />
                        <input
                          type="text"
                          placeholder="e.g. Priya Sharma"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="premium-input-group">
                      <label>{t('role', 'I am a...')}</label>
                      <div className="role-selector">
                        <button
                          type="button"
                          className={`role-option ${role === 'student' ? 'selected' : ''}`}
                          onClick={() => setRole('student')}
                        >
                          <span className="emoji">🎒</span> {t('student', 'Student')}
                        </button>
                        <button
                          type="button"
                          className={`role-option ${role === 'teacher' ? 'selected' : ''}`}
                          onClick={() => setRole('teacher')}
                        >
                          <span className="emoji">👩‍🏫</span> {t('teacher', 'Teacher')}
                        </button>
                      </div>
                    </div>

                    {role === 'student' && (
                      <motion.div 
                        className="premium-input-group"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <label>{t('grade', 'Grade Level')}</label>
                        <div className="input-container select-container">
                          <select
                            value={grade}
                            onChange={e => setGrade(e.target.value)}
                          >
                            {GRADES.map(g => (
                              <option key={g} value={g}>{t('grade')} {g}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Common Fields */}
                <div className="premium-input-group">
                  <label>{t('email', 'Email Address')}</label>
                  <div className="input-container">
                    <Mail size={18} className="icon" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="premium-input-group">
                  <label>{t('password', 'Password')}</label>
                  <div className="input-container">
                    <Lock size={18} className="icon" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  {mode === 'login' && (
                    <div className="forgot-password">
                      <a href="#">Forgot password?</a>
                    </div>
                  )}
                </div>

                {error && (
                  <motion.div 
                    className="premium-error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span>⚠️</span> {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="premium-submit-btn"
                  disabled={loading}
                >
                  <div className="btn-bg"></div>
                  <span className="btn-text">
                    {loading ? (
                      <span className="loading-spinner" />
                    ) : (
                      mode === 'login' ? t('login', 'Sign In') : t('register', 'Create Account')
                    )}
                  </span>
                </button>
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
