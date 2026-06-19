// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext()

// ── Demo mode: renders full UI without Firebase credentials ──
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'
const DEMO_USER    = { uid: 'demo-teacher', email: 'teacher@example.com' }
const DEMO_PROFILE = {
  name: 'Mrs. Priya Kumar', email: 'teacher@example.com',
  role: 'teacher', school: 'Sri Kumaran Public School',
}
// Set VITE_DEMO_MODE=student in .env to preview student role
const DEMO_STUDENT_PROFILE = {
  name: 'Arjun Sharma', email: 'student@example.com',
  role: 'student', grade: 'VI', school: 'Sri Kumaran Public School',
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(DEMO_MODE ? DEMO_USER : null)
  const [profile, setProfile] = useState(
    DEMO_MODE
      ? (import.meta.env.VITE_DEMO_MODE === 'student' ? DEMO_STUDENT_PROFILE : DEMO_PROFILE)
      : null
  )
  const [loading, setLoading] = useState(!DEMO_MODE)

  useEffect(() => {
    if (DEMO_MODE) return   // skip Firebase in demo mode
    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
          setUser(firebaseUser)
          setProfile(snap.exists() ? snap.data() : null)
        } catch {
          setUser(firebaseUser)
          setProfile(null)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email, password) => {
    if (DEMO_MODE) return Promise.resolve()
    const cred = await signInWithEmailAndPassword(auth, email, password)
    // Await the profile fetch immediately so state is ready before navigation
    try {
      const snap = await getDoc(doc(db, 'users', cred.user.uid))
      setUser(cred.user)
      setProfile(snap.exists() ? snap.data() : null)
    } catch (e) {
      console.error("Failed to fetch user profile during login", e)
    }
    return cred
  }

  const register = async (email, password, name, role, grade = null) => {
    if (DEMO_MODE) return Promise.resolve()
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const profileData = {
      name, email, role, grade,
      school: import.meta.env.VITE_SCHOOL_NAME || 'Sri Kumaran Public School',
      createdAt: new Date().toISOString(),
    }
    await setDoc(doc(db, 'users', cred.user.uid), profileData)
    setProfile(profileData)
    return cred
  }

  const logout = () => {
    if (DEMO_MODE) return Promise.resolve()
    return signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
