// functions/src/chatbot/index.js
// Groq LLaMA proxy — keeps API key server-side, adds school context

const Groq = require('groq-sdk')
const { verifyToken } = require('../utils')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are an AI Tutor for Sri Kumaran Public School, Bangalore, India.
You help students (Grades 4-10) and teachers with:
- NCERT curriculum topics for all subjects (Science, Mathematics, Social Studies, English, EVS)
- Exam preparation tips and study techniques
- Career guidance and aptitude
- School attendance and timetable queries

Rules:
- Keep responses clear, concise, and age-appropriate
- Use simple language for younger grades, more detailed explanations for higher grades
- When explaining science/math, use examples from everyday Indian life
- Be encouraging and positive
- If asked about something outside school/education scope, gently redirect
- Respond in the same language the student writes in (English or Hindi or any other Indian language)
- Format responses with bullet points or numbered lists when explaining steps`

// POST /chatbot/message
async function message(req, res) {
  try {
    await verifyToken(req)
    const { messages = [], userRole = 'student', grade = 'VI' } = req.body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' })
    }

    const systemWithContext = `${SYSTEM_PROMPT}
\nCurrent user role: ${userRole}
${grade ? `Current grade context: Grade ${grade}` : ''}`

    const completion = await groq.chat.completions.create({
      model:       'llama-3.3-70b-versatile',
      messages:    [
        { role: 'system', content: systemWithContext },
        ...messages.slice(-10).map(m => ({
          role:    m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      ],
      max_tokens:  512,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'I could not generate a response.'
    return res.json({ reply })
  } catch (err) {
    console.error('chatbot error:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = { message }
