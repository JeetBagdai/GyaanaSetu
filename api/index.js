const express = require('express')
const cors    = require('cors')
const ncert      = require('./src/ncert')
const attendance = require('./src/attendance')
const timetable  = require('./src/timetable')
const chatbot    = require('./src/chatbot')
const auth       = require('./src/auth')
const dashboard  = require('./src/dashboard')
const app = express()
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    /\.run\.app$/,
    'https://gyaanasetu-frontend-702753836810.asia-south1.run.app',
    'https://gyaanasetu-bnmit.netlify.app',
    /\.netlify\.app$/
  ],
  credentials: true,
}))
app.use(express.json())
const router = express.Router()

router.get('/ncert/lessons',   ncert.getLessons)
router.get('/ncert/lesson',    ncert.getLesson)
router.post('/ncert/progress', ncert.postProgress)
router.post('/ncert/quiz-result', ncert.postQuizResult)
router.get('/ncert/generate-quiz', ncert.generateQuiz)
router.post('/ncert/evaluate-answer', ncert.evaluateAnswer)
router.post('/attendance/session', attendance.createSession)
router.post('/attendance/mark',    attendance.markAttendance)
router.get('/attendance/report',   attendance.getReport)
router.post('/timetable/generate', timetable.generate)
router.post('/timetable/save',     timetable.save)
router.get('/timetable/get',       timetable.get)
router.post('/chatbot/message', chatbot.message)
router.post('/auth/setRole',  auth.setRole)
router.get('/auth/profile',   auth.getProfile)
router.get('/dashboard/stats', dashboard.getStats)
router.get('/health', (_, res) => res.json({ status: 'ok', service: 'gyanasetu-api' }))

app.use('/api', router)
module.exports = app
