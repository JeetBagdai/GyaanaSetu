// functions/src/timetable/index.js
// Greedy constraint-satisfaction timetable generator

const { db, verifyToken } = require('../utils')

const DAYS   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIMES  = ['8:00', '9:00', '10:00', '11:00', '12:00', '14:00', '15:00']
const LUNCH  = '13:00'

/**
 * Greedy scheduler:
 * 1. Assign each subject a repeating slot across the week
 * 2. Round-robin teachers per subject
 * 3. Skip lunch slot
 */
function generateSchedule(subjects, teachers, rooms, days, timeslots, busy) {
  const schedule = []

  days.forEach((day, dayIdx) => {
    const slots = []
    timeslots.forEach((time, timeIdx) => {
      const subjectIdx = (dayIdx * timeslots.length + timeIdx) % subjects.length
      const subject    = subjects[subjectIdx]
      const subjectTeachers = teachers.filter(t => t.subject === subject)
      
      let assignedTeacher = '—'
      
      // Try to find a subject teacher who is not busy
      for (const t of subjectTeachers) {
        if (!busy[day][time].has(t.name)) {
          assignedTeacher = t.name
          busy[day][time].add(t.name)
          break
        }
      }

      // Fallback: try ANY teacher who is not busy
      if (assignedTeacher === '—') {
        for (const t of teachers) {
          if (!busy[day][time].has(t.name)) {
            assignedTeacher = t.name
            busy[day][time].add(t.name)
            break
          }
        }
      }

      slots.push({ time, subject, teacher: assignedTeacher, room: `Room ${(timeIdx % rooms) + 1}` })
    })
    schedule.push({ day, slots })
  })

  return schedule
}

// POST /timetable/generate
async function generate(req, res) {
  try {
    await verifyToken(req)
    const {
      subjects   = ['Mathematics', 'Science', 'English', 'Social'],
      teachers   = [],
      rooms      = 3,
      days       = DAYS,
      timeslots  = TIMES,
      classId    = 'default',
    } = req.body

    // Fetch all existing timetables to prevent cross-grade conflicts
    const timetablesSnap = await db.collection('timetables').get()
    const allTimetables = timetablesSnap.docs
      .filter(doc => doc.id !== classId)
      .map(doc => doc.data().schedule)

    const busy = {}
    days.forEach(d => {
      busy[d] = {}
      timeslots.forEach(t => { busy[d][t] = new Set() })
    })

    allTimetables.forEach(schedule => {
      if (!schedule) return
      schedule.forEach(dayObj => {
        const d = dayObj.day
        if (!busy[d]) return
        dayObj.slots.forEach(slot => {
          const t = slot.time
          if (busy[d][t] && slot.teacher && slot.teacher !== '—') {
            busy[d][t].add(slot.teacher)
          }
        })
      })
    })

    const schedule = generateSchedule(subjects, teachers, rooms, days, timeslots, busy)
    return res.json({ schedule, classId })
  } catch (err) {
    console.error('generate error:', err)
    res.status(500).json({ error: err.message })
  }
}

// POST /timetable/save
async function save(req, res) {
  try {
    const decoded = await verifyToken(req)
    const { schedule, classId } = req.body

    await db.collection('timetables').doc(classId || 'default').set({
      schedule,
      classId,
      generatedBy: decoded.uid,
      generatedAt: new Date().toISOString(),
    })

    return res.json({ success: true })
  } catch (err) {
    console.error('save error:', err)
    res.status(500).json({ error: err.message })
  }
}

// GET /timetable/get?classId=default
async function get(req, res) {
  try {
    await verifyToken(req)
    const { classId } = req.query
    const snap = await db.collection('timetables').doc(classId || 'default').get()

    if (!snap.exists) return res.json({ schedule: null })
    return res.json(snap.data())
  } catch (err) {
    console.error('get error:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = { generate, save, get }
