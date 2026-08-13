// src/pages/Profile.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Lock, Save, CheckCircle2, AlertCircle,
  Eye, EyeOff, KeyRound, Loader, ShieldCheck,
} from 'lucide-react'
import {
  updatePassword,
  updateEmail,
  updateProfile as fbUpdateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import * as faceapi from '@vladmandic/face-api'

// ── small reusable field ──────────────────────────────────────────────────────
function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder, hint }) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Icon size={15} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          className="input"
          type={isPass && !show ? 'password' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ paddingLeft: '2.25rem', paddingRight: isPass ? '2.5rem' : '0.75rem', width: '100%' }}
          autoComplete={isPass ? 'new-password' : undefined}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hint && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  )
}

// ── alert banner ─────────────────────────────────────────────────────────────
function Alert({ type, message }) {
  if (!message) return null
  const isSuccess = type === 'success'
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.75rem 1rem', borderRadius: 0, fontSize: '0.85rem', fontWeight: 500,
        background: isSuccess ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${isSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
        color: isSuccess ? '#16a34a' : '#dc2626',
      }}>
      {isSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </motion.div>
  )
}

export default function Profile() {
  const { profile, user, setProfile } = useAuth()

  // ── form state ──────────────────────────────────────────────────────────────
  const [name,        setName]        = useState(profile?.name  || '')
  const [email,       setEmail]       = useState(profile?.email || '')
  const [currentPass, setCurrentPass] = useState('')
  const [newPass,     setNewPass]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const [saving,  setSaving]  = useState(false)
  const [alert,   setAlert]   = useState({ type: '', message: '' })

  const [isFaceRegistering, setIsFaceRegistering] = useState(false)
  const [faceModelLoading, setFaceModelLoading] = useState(false)
  const [faceStatus, setFaceStatus] = useState('')
  const videoRef = useRef(null)

  const showAlert = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert({ type: '', message: '' }), 5000)
  }

  // ── face registration handler ────────────────────────────────────────────────
  const handleStartFaceRegistration = async () => {
    setIsFaceRegistering(true)
    setFaceModelLoading(true)
    setFaceStatus('Loading face models...')
    
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
      
      setFaceStatus('Starting webcam...')
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setFaceModelLoading(false)
      setFaceStatus('Looking for your face...')
    } catch (err) {
      setFaceStatus('Error accessing webcam or loading models.')
      setFaceModelLoading(false)
      console.error(err)
    }
  }

  const captureFace = async () => {
    if (!videoRef.current) return
    setFaceStatus('Analyzing face...')
    try {
      const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor()
      if (!detection) {
        setFaceStatus('No face detected! Please look at the camera.')
        return
      }
      setFaceStatus('Face registered successfully!')
      const descriptorArray = Array.from(detection.descriptor)
      
      // Stop webcam
      const stream = videoRef.current.srcObject
      if (stream) stream.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
      
      // Save to Firestore
      const firebaseUser = auth.currentUser
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        faceDescriptor: descriptorArray,
        faceRegistered: true
      })
      
      setProfile(prev => ({ ...prev, faceRegistered: true }))
      setTimeout(() => {
        setIsFaceRegistering(false)
        setFaceStatus('')
      }, 2000)
    } catch (err) {
      setFaceStatus('Failed to extract face features.')
      console.error(err)
    }
  }

  const cancelFaceRegistration = () => {
    setIsFaceRegistering(false)
    setFaceStatus('')
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
  }

  // ── save handler ────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    setAlert({ type: '', message: '' })

    const firebaseUser = auth.currentUser
    if (!firebaseUser) return showAlert('error', 'Not authenticated. Please log in again.')

    const nameChanged  = name.trim()  !== (profile?.name  || '')
    const emailChanged = email.trim() !== (profile?.email || '')
    const passChanged  = newPass.trim() !== ''

    // Validate
    if (!name.trim())  return showAlert('error', 'Name cannot be empty.')
    if (!email.trim()) return showAlert('error', 'Email cannot be empty.')
    if (passChanged) {
      if (newPass.length < 6) return showAlert('error', 'New password must be at least 6 characters.')
      if (newPass !== confirmPass) return showAlert('error', 'Passwords do not match.')
    }

    // Re-auth required for email or password change
    if ((emailChanged || passChanged) && !currentPass) {
      return showAlert('error', 'Please enter your current password to change email or password.')
    }

    setSaving(true)
    try {
      // Re-authenticate if needed
      if (emailChanged || passChanged) {
        const credential = EmailAuthProvider.credential(firebaseUser.email, currentPass)
        await reauthenticateWithCredential(firebaseUser, credential)
      }

      // Update display name in Firebase Auth
      if (nameChanged) {
        await fbUpdateProfile(firebaseUser, { displayName: name.trim() })
      }

      // Update email in Firebase Auth
      if (emailChanged) {
        await updateEmail(firebaseUser, email.trim())
      }

      // Update password
      if (passChanged) {
        await updatePassword(firebaseUser, newPass)
      }

      // Update Firestore profile doc
      const updates = {}
      if (nameChanged)  updates.name  = name.trim()
      if (emailChanged) updates.email = email.trim()
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'users', firebaseUser.uid), updates)
      }

      // Update local context
      setProfile(prev => ({ ...prev, ...updates }))

      // Clear password fields
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')

      showAlert('success', 'Profile updated successfully!')
    } catch (err) {
      const msg =
        err.code === 'auth/wrong-password'       ? 'Current password is incorrect.'
        : err.code === 'auth/email-already-in-use' ? 'That email is already in use by another account.'
        : err.code === 'auth/invalid-email'        ? 'Please enter a valid email address.'
        : err.code === 'auth/requires-recent-login'? 'Session expired. Please log out and log in again.'
        : err.message
      showAlert('error', msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-inner">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Update your name, email and password</p>
        </div>
        <span className="badge badge-orange" style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}>
          {profile?.designation || profile?.role || 'Teacher'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Left: avatar card ──────────────────────────────────────────── */}
        <motion.div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Avatar circle */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700, color: '#fff', letterSpacing: '-1px',
            boxShadow: '0 8px 24px rgba(247,127,50,0.3)',
          }}>
            {(profile?.name || 'T').replace(/^(Dr\.|Mrs\.|Mr\.|Ms\.|Prof\.)\s*/i, '').split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('')}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{profile?.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{profile?.email}</div>
          </div>
          <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Role',        value: profile?.role },
              { label: 'Designation', value: profile?.designation },
              { label: 'Department',  value: profile?.department },
            ].map(({ label, value }) => value ? (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{value}</span>
              </div>
            ) : null)}
          </div>
          
          {/* Face Registration Section for Students */}
          {profile?.role === 'student' && (
            <div style={{ marginTop: '1rem', width: '100%', padding: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Face ID Attendance</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {profile?.faceRegistered ? (
                  <><CheckCircle2 size={16} color="#10b981" /> <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Face Registered</span></>
                ) : (
                  <><AlertCircle size={16} color="#f59e0b" /> <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>Face Not Registered</span></>
                )}
              </div>
              {!isFaceRegistering ? (
                <button type="button" onClick={handleStartFaceRegistration} className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}>
                  {profile?.faceRegistered ? 'Re-register Face' : 'Register Face'}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000', aspectRatio: '4/3' }}>
                    <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {faceModelLoading && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem' }}><Loader className="spin-anim" /></div>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>{faceStatus}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" onClick={captureFace} className="btn btn-primary" disabled={faceModelLoading} style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}>Capture</button>
                    <button type="button" onClick={cancelFaceRegistration} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ── Right: edit form ───────────────────────────────────────────── */}
        <motion.form className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          onSubmit={handleSave}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}>

          <AnimatePresence>
            {alert.message && <Alert type={alert.type} message={alert.message} />}
          </AnimatePresence>

          {/* ── Basic info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} /> Basic Information
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Your name and email are visible across the platform.
            </p>
          </div>

          <Field label="Full Name" icon={User} value={name} onChange={setName} placeholder="Dr. Your Name" />
          <Field label="Email Address" icon={Mail} value={email} onChange={setEmail} placeholder="you@bnmit.in"
            hint="Changing your email requires your current password." />

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <KeyRound size={15} /> Change Password
            </span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Leave blank if you don't want to change your password.
            </p>
          </div>

          <Field label="Current Password" icon={Lock} type="password" value={currentPass} onChange={setCurrentPass}
            placeholder="Required to change email or password" />
          <Field label="New Password" icon={Lock} type="password" value={newPass} onChange={setNewPass}
            placeholder="Min. 6 characters" hint="Leave empty to keep your current password." />
          <Field label="Confirm New Password" icon={ShieldCheck} type="password" value={confirmPass} onChange={setConfirmPass}
            placeholder="Repeat new password" />

          <button className="btn btn-primary" type="submit" disabled={saving}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            {saving ? <Loader size={15} className="spin-anim" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.form>
      </div>
    </div>
  )
}
