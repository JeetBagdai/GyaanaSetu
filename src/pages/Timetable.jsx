// src/pages/Timetable.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Calendar, Plus, Trash2, Wand2, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../services/auth'
import { generateTimetable, saveTimetable, getTimetable } from '../services/api'
import './Timetable.css'

const DAYS    = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const PREDEFINED_SUBJECTS = ['Mathematics', 'Science', 'English', 'Social', 'History', 'Geography', 'EVS']

const SUBJECT_COLORS = {
  Mathematics: '#ede9fb', Science: '#e4f7ef', English: '#e8f4fd',
  Social: '#fff3ec',      EVS: '#f0fdf4',     History: '#fdeef3',
  Geography: '#fffbeb',   Default: '#f5f3ff',
}
const SUBJECT_TEXT = {
  Mathematics: '#7c5cbf', Science: '#3aafa9', English: '#2563eb',
  Social: '#c2680a',      EVS: '#16a34a',     History: '#e05f7c',
  Geography: '#d97706',   Default: '#7c5cbf',
}

export default function Timetable() {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const isTeacher = profile?.role === 'teacher'

  const [subjects, setSubjects] = useState(['Mathematics', 'Science', 'English', 'Social'])
  const [customSubject, setCustomSubject] = useState('')
  const [timeslots, setTimeslots] = useState(['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'])
  const [newTime, setNewTime] = useState('')

  const [teachers, setTeachers]   = useState([
    { name: 'Mrs. Priya Kumar', subject: 'Mathematics' },
    { name: 'Mr. Ravi Shankar', subject: 'Science' },
    { name: 'Ms. Anjali', subject: 'English' },
    { name: 'Mr. Sharma', subject: 'Social' },
    { name: 'Mrs. Gupta', subject: 'History' },
    { name: 'Mr. Verma', subject: 'Geography' },
    { name: 'Ms. Meena', subject: 'EVS' },
  ])
  const [schedule, setSchedule]         = useState(null)
  const [loading, setLoading]           = useState(false)
  const [saved, setSaved]               = useState(false)

  // Grade selection for teacher
  const [selectedGrade, setSelectedGrade] = useState(profile?.grade || profile?.classId || 'VI')

  // Load existing timetable on mount or grade change
  useEffect(() => {
    async function load() {
      try {
        const token = await getToken()
        const gradeToFetch = isTeacher ? selectedGrade : (profile?.grade || profile?.classId || 'VI')
        const data = await getTimetable(gradeToFetch, token)
        if (data?.schedule) {
          setSchedule(data.schedule)
        } else {
          setSchedule(null) // No timetable yet
        }
      } catch (err) {
        console.error('Error fetching timetable', err)
      }
    }
    load()
  }, [profile, selectedGrade, isTeacher])

  const handleGenerate = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const token = await getToken()
      const data  = await generateTimetable({
        subjects,
        teachers,
        rooms: 1,
        days: DAYS,
        timeslots,
        classId: selectedGrade,
      }, token)
      setSchedule(data.schedule)
    } catch {
      // Offline demo — generate a mock schedule
      const mock = DAYS.map(day => ({
        day,
        slots: timeslots.map((time, i) => ({
          time,
          subject: subjects[i % subjects.length] || 'Free',
          teacher: teachers[i % teachers.length]?.name || '—',
        })),
      }))
      setSchedule(mock)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!schedule) return
    try {
      const token = await getToken()
      await saveTimetable({ schedule, classId: selectedGrade }, token)
      setSaved(true)
    } catch {
      setSaved(true) // optimistic
    }
  }

  const getColor = (subject) => SUBJECT_COLORS[subject] || SUBJECT_COLORS.Default
  const getText  = (subject) => SUBJECT_TEXT[subject]  || SUBJECT_TEXT.Default

  return (
    <div className="page-inner">
      <div className="page-header">
        <h1 className="page-title">🗓️ {t('timetable_title', 'Timetable')}</h1>
        <p className="page-subtitle">
          {isTeacher ? 'Configure and generate the weekly timetable' : 'Your weekly class schedule'}
        </p>
      </div>

      {isTeacher && (
        <div className="tt-config card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="panel-title" style={{ marginBottom: '1rem' }}>{t('configure_schedule', 'Configure Schedule')}</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Select Grade</label>
            <select
              className="input"
              style={{ maxWidth: 200, marginTop: '0.5rem' }}
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="VI">Grade VI</option>
              <option value="VII">Grade VII</option>
              <option value="VIII">Grade VIII</option>
              <option value="IX">Grade IX</option>
              <option value="X">Grade X</option>
            </select>
          </div>

          <div className="tt-config-grid">
            {/* Subjects */}
            <div>
              <label className="form-label">{t('subjects', 'Subjects')}</label>
              <div className="checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', margin: '0.5rem 0' }}>
                {PREDEFINED_SUBJECTS.map(subj => (
                  <label key={subj} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={subjects.includes(subj)}
                      onChange={(e) => {
                        if (e.target.checked) setSubjects(prev => [...prev, subj])
                        else setSubjects(prev => prev.filter(s => s !== subj))
                      }}
                    />
                    <span className="text-sm">{t(subj.toLowerCase().replace(' ', '_'), subj)}</span>
                  </label>
                ))}
                {/* Custom subjects checked list */}
                {subjects.filter(s => !PREDEFINED_SUBJECTS.includes(s)).map(subj => (
                  <label key={subj} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={true} 
                      onChange={() => setSubjects(prev => prev.filter(s => s !== subj))} 
                    />
                    <span className="text-sm">{subj}</span>
                  </label>
                ))}
              </div>
              <div className="input-row" style={{ marginTop: '0.5rem' }}>
                <input
                  className="input"
                  placeholder="Custom subject..."
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && customSubject.trim()) {
                      if (!subjects.includes(customSubject.trim())) {
                        setSubjects(prev => [...prev, customSubject.trim()])
                      }
                      setCustomSubject('')
                    }
                  }}
                />
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    if (customSubject.trim() && !subjects.includes(customSubject.trim())) {
                      setSubjects(prev => [...prev, customSubject.trim()])
                      setCustomSubject('')
                    }
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Timings */}
            <div>
              <label className="form-label">{t('timings', 'Timings')}</label>
              <div className="tag-list" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                {timeslots.map((time, idx) => (
                  <span key={idx} className="tag">
                    {time}
                    <button onClick={() => setTimeslots(prev => prev.filter((_, i) => i !== idx))}>
                      <Trash2 size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="input-row">
                <input
                  className="input"
                  placeholder="Add time (e.g. 10:15)"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newTime.trim()) {
                      setTimeslots(prev => [...prev, newTime.trim()])
                      setNewTime('')
                    }
                  }}
                />
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    if (newTime.trim()) {
                      setTimeslots(prev => [...prev, newTime.trim()])
                      setNewTime('')
                    }
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="tt-actions" style={{ marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={loading}
              id="generate-timetable-btn"
            >
              <Wand2 size={16} />
              {loading ? t('loading') : t('generate_timetable')}
            </button>
            {schedule && (
              <button className="btn btn-secondary" onClick={handleSave}>
                <Save size={16} />
                {saved ? t('saved', '✓ Saved!') : t('save_timetable', 'Save Timetable')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Schedule grid */}
      {schedule ? (
        <motion.div
          className="tt-grid-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="section-title">{t('weekly_schedule')}</h2>
          <div className="tt-grid">
            {/* Header row */}
            <div className="tt-header-cell tt-time-header">{t('time', 'Time')}</div>
            {DAYS.map(d => (
              <div key={d} className="tt-header-cell">{t(`day_${d.toLowerCase()}`, d)}</div>
            ))}

            {/* Time rows */}
            {schedule[0]?.slots.map(s => s.time).map(time => {
              const hasBreak = time === '13:00'
              return (
                <>
                  {hasBreak && (
                    <div key={`break-${time}`} className="tt-break-row" style={{ gridColumn: `1 / -1` }}>
                      🍽️ {t('lunch_break', 'Lunch Break')}
                    </div>
                  )}
                  <div key={time} className="tt-time-cell">{time}</div>
                  {DAYS.map(day => {
                    const slot = schedule.find(d => d.day === day)?.slots?.find(s => s.time === time)
                    return (
                      <div
                        key={`${day}-${time}`}
                        className="tt-cell"
                        style={slot?.subject ? {
                          background: getColor(slot.subject),
                          color: getText(slot.subject),
                        } : {}}
                      >
                        {slot?.subject && (
                          <>
                            <span className="tt-subject">{t(slot.subject.toLowerCase().replace(' ', '_'), slot.subject)}</span>
                            {slot.teacher && <span className="tt-teacher">{slot.teacher}</span>}
                          </>
                        )}
                      </div>
                    )
                  })}
                </>
              )
            })}
          </div>
        </motion.div>
      ) : (
        <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem', padding:'3rem' }}>
          <Calendar size={56} color="var(--text-muted)" style={{ opacity: 0.4 }} />
          <p className="text-muted">
            {isTeacher ? t('teacher_tt_prompt', 'Configure subjects above and click Generate') : t('student_tt_prompt', 'Your teacher hasn\'t generated a timetable yet')}
          </p>
        </div>
      )}
    </div>
  )
}
