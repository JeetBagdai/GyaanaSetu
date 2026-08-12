import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.join(__dirname, '..', '.env')
let env = ''
try {
  env = fs.readFileSync(envPath, 'utf8')
} catch (e) {
  console.log("No .env found, using default project")
}
const projectMatch = env.match(/VITE_FIREBASE_PROJECT_ID=(.*)/)
const PROJECT = projectMatch ? projectMatch[1].trim() : 'gyaanasetu-bnmit'

const MAX_STUDENTS_PER_SECTION = 60
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F']

async function run() {
  console.log('Fetching all students...')
  const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery`
  
  const queryBody = {
    structuredQuery: {
      from: [{ collectionId: 'users' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'role' },
          op: 'EQUAL',
          value: { stringValue: 'student' }
        }
      }
    }
  }
  
  const res = await fetch(queryUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(queryBody)
  })
  
  const data = await res.json()
  
  if (!data || data.length === 0 || !data[0].document) {
    console.log('No students found.')
    return
  }

  const studentsBySem = {}

  for (const item of data) {
    if (!item.document) continue
    const doc = item.document
    const fields = doc.fields || {}
    
    let semNum = fields.semester?.integerValue || fields.semester?.stringValue
    if (!semNum && fields.classId?.stringValue) {
      const match = fields.classId.stringValue.match(/SEM(\d+)/)
      if (match) semNum = match[1]
    }
    
    if (!semNum) semNum = '5'
    
    const baseClassId = `AIML-SEM${semNum}`
    
    if (!studentsBySem[baseClassId]) {
      studentsBySem[baseClassId] = []
    }
    
    studentsBySem[baseClassId].push({
      docName: doc.name,
      name: fields.name?.stringValue || '',
      email: fields.email?.stringValue || '',
      currentClassId: fields.classId?.stringValue || ''
    })
  }

  let totalUpdated = 0

  for (const [baseClassId, students] of Object.entries(studentsBySem)) {
    console.log(`\nProcessing ${baseClassId} (${students.length} students)`)
    
    // Sort alphabetically by name
    students.sort((a, b) => a.name.localeCompare(b.name))

    let currentSectionIndex = 0
    let countInSection = 0

    for (const student of students) {
      if (countInSection >= MAX_STUDENTS_PER_SECTION) {
        currentSectionIndex++
        countInSection = 0
        if (currentSectionIndex >= SECTIONS.length) {
          console.error(`ERROR: Ran out of sections for ${baseClassId}!`)
          process.exit(1)
        }
      }

      const sectionLetter = SECTIONS[currentSectionIndex]
      const newClassId = `${baseClassId}-${sectionLetter}`
      
      if (student.currentClassId !== newClassId) {
        const updateMask = '?updateMask.fieldPaths=classId'
        const patchBody = {
          fields: {
            classId: { stringValue: newClassId }
          }
        }
        
        await fetch(`https://firestore.googleapis.com/v1/${student.docName}${updateMask}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patchBody)
        })
        
        totalUpdated++
        console.log(`  - Reassigned ${student.name} (${student.email}) -> ${newClassId}`)
      } else {
        console.log(`  - ${student.name} is already in ${newClassId}, skipping.`)
      }

      countInSection++
    }
  }

  console.log(`\nSuccessfully updated ${totalUpdated} students.`)
}

run().catch(console.error)
