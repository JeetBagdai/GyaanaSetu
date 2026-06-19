// src/pages/Attendance.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { QrCode, Camera, CheckCircle, XCircle, PlayCircle, StopCircle, Users } from 'lucide-react'
import { QRCodeSVG as QRCode } from 'qrcode.react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../services/auth'
import { createAttendanceSession, markAttendance, getAttendanceReport } from '../services/api'
import './Attendance.css'

function QrScannerBox({ onScan, onCancel }) {
  const onScanRef = useRef(onScan)

  useEffect(() => {
    onScanRef.current = onScan
  }, [onScan])

  useEffect(() => {
    let scanner = null
    const timer = setTimeout(() => {
      scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false)
      scanner.render(
        (text) => {
          scanner.clear()
          if (onScanRef.current) onScanRef.current(text)
        },
        (err) => {}
      )
    }, 150) // Small delay to bypass React 18 StrictMode double-mount

    return () => {
      clearTimeout(timer)
      if (scanner) {
        scanner.clear().catch(() => {})
      }
    }
  }, [])

  return (
    <>
      <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>
        Point your camera at the QR code
      </p>
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginTop: '1rem' }}
        onClick={onCancel}
      >
        Cancel
      </button>
    </>
  )
}


export default function Attendance() {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const isTeacher = profile?.role === 'teacher'

  // Teacher state
  const [session, setSession]         = useState(null)   // { sessionId, qrData, expiresAt }
  const [sessionActive, setSessionActive] = useState(false)
  const [presentStudents, setPresentStudents] = useState([])
  const [loadingSession, setLoadingSession]   = useState(false)

  // Polling for live attendance updates
  useEffect(() => {
    let interval;
    const classIdToUse = profile?.classId || 'default';

    if (sessionActive && session?.sessionId) {
      console.log('[Attendance] Starting poll for session:', session.sessionId, 'classId:', classIdToUse);
      interval = setInterval(async () => {
        try {
          const token = await getToken()
          const today = new Date().toISOString().split('T')[0]
          const report = await getAttendanceReport(classIdToUse, today, token)
          
          console.log('[Attendance] Raw report from server:', report);
          
          // Filter by the current session ID
          const currentSessionStudents = report.present.filter(s => s.sessionId === session.sessionId)
          console.log('[Attendance] Filtered students for this session:', currentSessionStudents);
          
          setPresentStudents(currentSessionStudents.map(s => ({
            id: s.studentId,
            name: s.name || `Student (${s.studentId.slice(0,4)})`
          })))
        } catch (err) {
          console.error('[Attendance] Error fetching live attendance', err)
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [sessionActive, profile, session])

  // Student state
  const [scanResult, setScanResult]   = useState(null)   // 'success' | 'expired' | 'error'
  const [scanning, setScanning]       = useState(false)

  // ── TEACHER: Start session ──────────────────────────
  const handleStartClass = async () => {
    setLoadingSession(true)
    try {
      const token = await getToken()
      const data  = await createAttendanceSession({
        classId:   profile?.classId || 'default',
        teacherId: profile?.uid,
        subject:   'General',
      }, token)
      setSession(data)
      setSessionActive(true)
      setPresentStudents([])
    } catch {
      alert('Could not create session. Make sure Cloud Functions are deployed.')
    } finally {
      setLoadingSession(false)
    }
  }

  const handleEndClass = () => {
    setSession(null)
    setSessionActive(false)
  }



  return (
    <div className="page-inner">
      <div className="page-header">
        <h1 className="page-title">✅ {t('attendance')}</h1>
        <p className="page-subtitle">
          {isTeacher ? 'Generate QR codes and track attendance' : 'Scan the class QR to mark your presence'}
        </p>
      </div>

      {/* ── TEACHER VIEW ── */}
      {isTeacher && (
        <div className="attendance-teacher">
          <div className="attendance-panel card">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">{t('class_session', 'Class Session')}</h2>
                <p className="text-muted text-sm">{t('start_session_desc', 'Start a session to generate a QR code')}</p>
              </div>
              {!sessionActive ? (
                <button
                  className="btn btn-primary"
                  onClick={handleStartClass}
                  disabled={loadingSession}
                  id="start-class-btn"
                >
                  <PlayCircle size={16} />
                  {loadingSession ? t('loading') : t('start_class')}
                </button>
              ) : (
                <button className="btn btn-danger" onClick={handleEndClass} id="end-class-btn">
                  <StopCircle size={16} />
                  {t('end_class')}
                </button>
              )}
            </div>

            {sessionActive && session && (
              <motion.div
                className="qr-display"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="qr-wrapper">
                  <QRCode
                    value={session.qrData || session.sessionId || 'demo-session'}
                    size={256}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin
                  />
                </div>
                <div className="qr-info">
                  <span className="badge badge-teal">● Live Session</span>
                  <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
                    Session ID: <code>{session.sessionId?.slice(0, 12)}...</code>
                  </p>
                  <p className="text-xs text-muted">
                    Valid for 2 minutes from scan
                  </p>
                </div>
              </motion.div>
            )}

            {!sessionActive && (
              <div className="qr-placeholder">
                <QrCode size={64} color="var(--text-muted)" style={{ opacity: 0.3 }} />
                <p className="text-muted text-sm">{t('start_class_to_gen', 'Start a class to generate QR')}</p>
              </div>
            )}
          </div>

          {/* Attendance feed */}
          <div className="card" style={{ flex: 1 }}>
            <div className="panel-header" style={{ marginBottom: '1rem' }}>
              <h2 className="panel-title">{t('students_present')}</h2>
              <span className="badge badge-teal">{presentStudents.length} present</span>
            </div>
            {presentStudents.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem', padding:'2rem' }}>
                <Users size={40} color="var(--text-muted)" style={{ opacity: 0.4 }} />
                <p className="text-muted text-sm">Waiting for students to scan...</p>
              </div>
            ) : (
              <div className="present-list">
                {presentStudents.map(s => (
                  <div key={s.id} className="present-item">
                    <div className="present-avatar">{s.name?.[0]}</div>
                    <span className="text-sm font-medium">{s.name}</span>
                    <CheckCircle size={14} color="var(--accent-success)" style={{ marginLeft:'auto' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STUDENT VIEW ── */}
      {!isTeacher && (
        <div className="attendance-student">
          {/* Always render the div in the DOM so html5-qrcode can NEVER fail to find it */}
          <div id="qr-reader" className="qr-reader-box" style={{ display: scanning ? 'block' : 'none' }} />

          <AnimatePresence mode="wait">
            {!scanning && !scanResult && (
              <motion.div
                key="idle"
                className="card scan-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QrCode size={72} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
                <h2 className="panel-title" style={{ marginTop: '1rem' }}>Ready to Attend?</h2>
                <p className="text-muted text-sm">Ask your teacher to start the class, then scan the QR code</p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => { setScanning(true); setScanResult(null) }}
                  id="scan-qr-btn"
                >
                  <Camera size={16} />
                  {t('scan_qr')}
                </button>
              </motion.div>
            )}

            {scanning && (
              <motion.div
                key="scanning"
                className="card scan-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <QrScannerBox
                  onScan={async (text) => {
                    setScanning(false)
                    try {
                      const token = await getToken()
                      await markAttendance({ qrData: text, studentId: profile?.uid, name: profile?.name }, token)
                      setScanResult('success')
                    } catch (e) {
                      setScanResult(e.message?.includes('expired') ? 'expired' : 'error')
                    }
                  }}
                  onCancel={() => setScanning(false)}
                />
              </motion.div>
            )}

            {scanResult === 'success' && (
              <motion.div
                key="success"
                className="card scan-card result-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle size={72} color="var(--accent-success)" />
                <h2 className="panel-title" style={{ color:'var(--accent-success)' }}>{t('marked_present')}</h2>
                <p className="text-muted text-sm">{t('attendance_recorded', 'Your attendance has been recorded')}</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setScanResult(null)}>Done</button>
              </motion.div>
            )}

            {(scanResult === 'expired' || scanResult === 'error') && (
              <motion.div
                key="error"
                className="card scan-card result-error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <XCircle size={72} color="var(--accent-danger)" />
                <h2 className="panel-title" style={{ color:'var(--accent-danger)' }}>
                  {scanResult === 'expired' ? 'QR Expired' : 'Error'}
                </h2>
                <p className="text-muted text-sm">
                  {scanResult === 'expired' ? t('qr_expired') : 'Could not mark attendance. Try again.'}
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setScanResult(null); setScanning(false) }}
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
