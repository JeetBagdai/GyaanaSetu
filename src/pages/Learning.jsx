// src/pages/Learning.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { BookOpen, ChevronRight, Send, X, Loader, FileText, Bot, Clock, CheckCircle2, Play, Pause } from 'lucide-react'
import Draggable from 'react-draggable'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../services/auth'
import { getNcertLessons, getNcertLesson, postNcertProgress } from '../services/api'
import { sendChatMessage } from '../services/api'
import './Learning.css'

const GRADES = ['IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

const SUBJECTS_BY_GRADE = {
  IV:  ['EVS', 'English', 'Mathematics'],
  V:   ['EVS', 'English', 'Mathematics'],
  VI:  ['Science', 'Social', 'English', 'Mathematics'],
  VII: ['Science', 'Social', 'English', 'Mathematics'],
  VIII:['Science', 'Social', 'English', 'Mathematics'],
  IX:  ['Science', 'Social_History', 'Social_Geography', 'English', 'Mathematics'],
  X:   ['Science', 'Social_History', 'Social_Geography', 'English', 'Mathematics'],
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Learning() {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const defaultGrade = profile?.grade || 'VI'
  const [grade, setGrade]     = useState(defaultGrade)
  const [subject, setSubject] = useState(SUBJECTS_BY_GRADE[defaultGrade]?.[0] || 'Science')
  const [chapters, setChapters] = useState([])
  const [selected, setSelected] = useState(null)     // { title, url, chapter }
  const [loadingList, setLoadingList]   = useState(false)
  const [loadingPDF, setLoadingPDF]     = useState(false)

  // Reading timer
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef(null)

  // AI sidebar
  const [aiOpen, setAiOpen]       = useState(false)
  const [aiInput, setAiInput]     = useState('')
  const [aiMsgs, setAiMsgs]       = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const aiEndRef = useRef(null)
  const dragRef = useRef(null)

  // ── Timer logic ─────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) return
    setTimerRunning(true)
    timerRef.current = setInterval(() => {
      setTimerSeconds(s => s + 1)
    }, 1000)
  }, [])

  const pauseTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setTimerRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setTimerRunning(false)
    setTimerSeconds(0)
  }, [])

  // Cleanup on unmount
  useEffect(() => () => clearInterval(timerRef.current), [])

  // Load chapter list
  useEffect(() => {
    const load = async () => {
      setLoadingList(true)
      setChapters([])
      setSelected(null)
      resetTimer()
      try {
        const token = await getToken()
        const data  = await getNcertLessons(grade, subject, token)
        setChapters(data.chapters || [])
      } catch {
        setChapters([
          { id: '1', title: 'Chapter 1 (connect GCS to load)', filename: '' },
        ])
      } finally {
        setLoadingList(false)
      }
    }
    load()
  }, [grade, subject])

  // Scroll AI to bottom
  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMsgs])

  const handleOpenChapter = async (chapter) => {
    resetTimer()
    setLoadingPDF(true)
    try {
      const token = await getToken()
      const data  = await getNcertLesson(grade, subject, chapter.filename, token)
      setSelected({ title: chapter.title, url: data.url, chapter })
      postNcertProgress({ grade, subject, chapterId: chapter.id, completedAt: new Date().toISOString() }, token)
      // Auto-start timer when chapter opens
      setTimeout(startTimer, 200)
    } catch (e) {
      alert('Could not load PDF. Make sure GCS is configured and the syllabus upload script has been run.')
    } finally {
      setLoadingPDF(false)
    }
  }

  const handleMarkComplete = () => {
    pauseTimer()
    
    // Find index of selected chapter to map correctly to static quizzes
    const index = chapters.findIndex(c => c.id === selected?.chapter?.id)
    
    navigate('/quiz', {
      state: {
        grade,
        subject,
        chapter: selected?.title,
        chapterIndex: index >= 0 ? index : 0,
        timeSpent: timerSeconds,
      }
    })
  }

  const handleAiSend = async () => {
    if (!aiInput.trim() || aiLoading) return
    const userMsg = { role: 'user', content: aiInput }
    setAiMsgs(prev => [...prev, userMsg])
    setAiInput('')
    setAiLoading(true)
    try {
      const token = await getToken()
      const context = selected
        ? `The student is currently reading: "${selected.title}" (Grade ${grade} ${subject}). `
        : `The student is browsing Grade ${grade} ${subject}. `
      const messagesWithCtx = [
        { role: 'user', content: context + aiInput },
        ...aiMsgs.slice(-6),
        userMsg,
      ]
      const data = await sendChatMessage(messagesWithCtx, profile?.role, grade, token)
      setAiMsgs(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setAiMsgs(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not connect right now. Please try again.' }])
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="page-inner learning-page">


      <div className="learning-layout">
        {/* LEFT: Selector + Chapter list */}
        <div className="learning-sidebar">
          {/* Grade */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">{t('select_grade')}</label>
            <select
              className="select"
              value={grade}
              onChange={e => {
                setGrade(e.target.value)
                setSubject(SUBJECTS_BY_GRADE[e.target.value]?.[0] || '')
              }}
              disabled={profile?.role === 'student'}
            >
              {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </div>

          {/* Subject */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">{t('select_subject')}</label>
            <select
              className="select"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            >
              {(SUBJECTS_BY_GRADE[grade] || []).map(s => (
                <option key={s} value={s}>{t(s.toLowerCase(), s.replace('_', ' '))}</option>
              ))}
            </select>
          </div>

          {/* Chapter list */}
          <div className="chapter-list">
            <p className="form-label" style={{ marginBottom: '0.5rem' }}>
              {t('select_chapter')}
            </p>
            {loadingList ? (
              <div style={{ display:'flex', justifyContent:'center', padding:'2rem' }}>
                <div className="spinner" />
              </div>
            ) : chapters.length === 0 ? (
              <div className="chapter-empty">{t('no_chapters_found', 'No chapters found')}</div>
            ) : (
              chapters.map((ch, i) => (
                <motion.button
                  key={ch.id}
                  className={`chapter-item ${selected?.title === ch.title ? 'active' : ''}`}
                  onClick={() => handleOpenChapter(ch)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <FileText size={14} style={{ flexShrink: 0 }} />
                  <span className="chapter-title">{t(`chapter_${ch.id}`, ch.title)}</span>
                  <ChevronRight size={14} className="chapter-arrow" />
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* CENTER: PDF viewer */}
        <div className="learning-viewer">
          {loadingPDF ? (
            <div className="viewer-empty">
              <div className="spinner" style={{ width: 48, height: 48 }} />
              <p className="text-muted">{t('loading_pdf', 'Loading PDF...')}</p>
            </div>
          ) : selected ? (
            <>
              <div className="viewer-header">
                <div>
                  <h2 className="viewer-title">{selected.title}</h2>
                  <p className="text-muted text-sm">Grade {grade} · {subject.replace('_', ' ')}</p>
                </div>

                {/* Timer + actions row */}
                <div className="viewer-actions">
                  {/* Reading Timer */}
                  <div className="reading-timer">
                    <Clock size={13} />
                    <span className="timer-display">{formatTime(timerSeconds)}</span>
                    <button
                      className="btn btn-ghost btn-sm timer-toggle"
                      onClick={timerRunning ? pauseTimer : startTimer}
                      title={timerRunning ? 'Pause timer' : 'Resume timer'}
                    >
                      {timerRunning ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setAiOpen(o => !o)}
                  >
                    <Bot size={14} />
                    {t('ask_ai')}
                  </button>

                  <button
                    className="btn btn-primary btn-sm complete-btn"
                    onClick={handleMarkComplete}
                  >
                    <CheckCircle2 size={14} />
                    Mark as Complete
                  </button>
                </div>
              </div>
              <iframe
                src={selected.url}
                className="pdf-iframe"
                title={selected.title}
              />
            </>
          ) : (
            <div className="viewer-empty">
              <BookOpen size={56} color="var(--text-muted)" style={{ opacity: 0.4 }} />
              <p className="text-muted">{t('select_chapter_reading', 'Select a chapter to start reading')}</p>
            </div>
          )}

          {/* AI Sidebar Overlay */}
          <AnimatePresence>
            {aiOpen && (
              <Draggable nodeRef={dragRef} handle=".ai-header" bounds="parent">
                <div ref={dragRef} style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50, height: 'calc(100% - 2rem)', maxHeight: 600 }}>
                  <motion.div
                    className="ai-sidebar"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="ai-header">
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <Bot size={18} color="var(--accent-primary)" />
                        <span className="font-heading font-bold">AI Tutor</span>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setAiOpen(false)}>
                        <X size={14} />
                      </button>
                    </div>

                    <div className="ai-messages">
                      {aiMsgs.length === 0 && (
                        <div className="ai-welcome">
                          <Bot size={32} color="var(--accent-primary)" style={{ opacity: 0.6 }} />
                          <p className="text-sm text-muted">
                            {t('ask_me_anything_about', 'Ask me anything about')} <strong>{selected?.title || t('this_subject', 'this subject')}</strong>!
                          </p>
                        </div>
                      )}
                      {aiMsgs.map((m, i) => (
                        <div key={i} className={`ai-bubble ${m.role}`}>
                          {m.content}
                        </div>
                      ))}
                      {aiLoading && (
                        <div className="ai-bubble assistant">
                          <Loader size={14} className="spin-anim" />
                          Thinking...
                        </div>
                      )}
                      <div ref={aiEndRef} />
                    </div>

                    <div className="ai-input-row">
                      <input
                        className="input"
                        style={{ borderRadius: 'var(--border-radius-full)', fontSize: '0.8rem' }}
                        placeholder={t('chat_placeholder')}
                        value={aiInput}
                        onChange={e => setAiInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, justifyContent:'center' }}
                        onClick={handleAiSend}
                        disabled={aiLoading}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </Draggable>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
