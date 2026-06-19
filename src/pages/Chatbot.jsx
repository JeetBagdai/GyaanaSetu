// src/pages/Chatbot.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Send, Trash2, Bot, User, Loader, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../services/auth'
import { sendChatMessage } from '../services/api'
import './Chatbot.css'

const SUGGESTED = [
  'Explain photosynthesis in simple words',
  'What are the properties of a triangle?',
  'How do I prepare for my Science exam?',
  'What is the difference between speed and velocity?',
  'Tell me about the French Revolution',
]

export default function Chatbot() {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chatbot_welcome', `Namaste! 🙏 I'm your AI Tutor. I can help you with NCERT topics (Grades IV–X), exam preparation, and more. What would you like to learn today?`),
    },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')

    const userMsg = { role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const token = await getToken()
      const history = [...messages, userMsg].slice(-10)
      const data = await sendChatMessage(history, profile?.role, profile?.grade, token)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t('chatbot_error', '⚠️ I couldn\'t connect right now. Please check your internet or Cloud Functions configuration.'),
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([{
      role: 'assistant',
      content: t('chat_cleared', 'Chat cleared! What would you like to learn? 😊'),
    }])
  }

  return (
    <div className="page-inner chatbot-page">
      <div className="page-header chatbot-header">
        <div>
          <h1 className="page-title">🤖 {t('chatbot')}</h1>
          <p className="page-subtitle">{t('chatbot_subtitle', 'Powered by Groq LLaMA 3.3-70B · Context-aware NCERT tutor')}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleClear} id="clear-chat-btn">
          <Trash2 size={14} /> {t('clear_chat')}
        </button>
      </div>

      <div className="chatbot-container">
        {/* Messages */}
        <div className="chatbot-messages">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`chat-message ${msg.role}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="chat-avatar">
                  {msg.role === 'assistant'
                    ? <Bot size={16} />
                    : <User size={16} />
                  }
                </div>
                <div className="chat-bubble">
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              className="chat-message assistant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="chat-avatar"><Bot size={16} /></div>
              <div className="chat-bubble typing">
                <span /><span /><span />
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="chat-suggestions">
            <p className="text-xs text-muted" style={{ marginBottom: '0.5rem' }}>
              <Sparkles size={12} style={{ display:'inline', marginRight:4 }} />
              {t('try_asking', 'Try asking:')}
            </p>
            <div className="suggestions-grid">
              {SUGGESTED.map((s, i) => (
                <button key={i} className="suggestion-chip" onClick={() => handleSend(t(`suggested_${i+1}`, s))}>
                  {t(`suggested_${i+1}`, s)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="chat-input-bar">
          <input
            id="chat-input"
            className="input chat-input"
            placeholder={t('chat_placeholder')}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={loading}
          />
          <motion.button
            className="btn btn-primary chat-send-btn"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            whileTap={{ scale: 0.92 }}
            id="chat-send-btn"
          >
            {loading ? <Loader size={18} className="spin-anim" /> : <Send size={18} />}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
