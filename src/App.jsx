// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Learning from './pages/Learning'
import Attendance from './pages/Attendance'
import Timetable from './pages/Timetable'

import Chatbot from './pages/Chatbot'
import Quiz from './pages/Quiz'
import './services/i18n'
// Note: Eco tasks feature removed

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="page-layout">
      <Sidebar className={sidebarOpen ? 'open' : ''} />
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/learning" element={
              <ProtectedRoute>
                <AppLayout><Learning /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute>
                <AppLayout><Attendance /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/timetable" element={
              <ProtectedRoute>
                <AppLayout><Timetable /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <AppLayout><Chatbot /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/quiz" element={
              <ProtectedRoute>
                <AppLayout><Quiz /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
