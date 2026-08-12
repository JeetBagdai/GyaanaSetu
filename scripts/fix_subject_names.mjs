import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPracticalSubjects } from '../src/data/learningContent.js'

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

async function fixNames() {
  for (let sem = 3; sem <= 6; sem++) {
    const subjects = getPracticalSubjects(sem)
    
    // Fetch all problems for this semester
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery`
    
    const queryBody = {
      structuredQuery: {
        from: [{ collectionId: 'coding_problems' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'semester' },
            op: 'EQUAL',
            value: { integerValue: sem }
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
    
    for (const item of data) {
      if (!item.document) continue
      const doc = item.document
      const docName = doc.name
      const currentSubject = doc.fields.subject?.stringValue
      
      if (!currentSubject) continue
      
      // If currentSubject has 'Lab' but original doesn't, fix it.
      let newSubject = null
      
      // Try to find a match by removing spaces and 'Lab'
      const normalizedCurrent = currentSubject.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().replace(/lab$/, '')
      
      for (const s of subjects) {
        const normalizedS = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        if (normalizedCurrent === normalizedS || normalizedCurrent.includes(normalizedS) || normalizedS.includes(normalizedCurrent)) {
          if (currentSubject !== s) {
            newSubject = s
          }
          break
        }
      }
      
      if (newSubject) {
        console.log(`Fixing ${currentSubject} -> ${newSubject}`)
        
        // Patch document
        const updateMask = '?updateMask.fieldPaths=subject'
        const patchBody = {
          fields: {
            subject: { stringValue: newSubject }
          }
        }
        
        await fetch(`https://firestore.googleapis.com/v1/${docName}${updateMask}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patchBody)
        })
      }
    }
  }
  console.log("Done fixing subjects.")
}

fixNames().catch(console.error)
