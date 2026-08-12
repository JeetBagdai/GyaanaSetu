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

async function assignModules() {
  console.log('Fetching all problems...')
  const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery`
  
  const queryBody = {
    structuredQuery: {
      from: [{ collectionId: 'coding_problems' }]
    }
  }
  
  const res = await fetch(queryUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(queryBody)
  })
  
  const data = await res.json()
  
  const grouped = {}
  
  for (const item of data) {
    if (!item.document) continue
    const doc = item.document
    const docName = doc.name
    
    // Extract fields
    const subject = doc.fields.subject?.stringValue || doc.fields.subjectCode?.stringValue || 'Unknown'
    const title = doc.fields.title?.stringValue || ''
    const order = doc.fields.order?.integerValue ? parseInt(doc.fields.order.integerValue) : undefined
    
    if (!grouped[subject]) grouped[subject] = []
    
    grouped[subject].push({
      docName,
      title,
      order,
      fields: doc.fields
    })
  }
  
  let totalUpdated = 0
  
  for (const subject of Object.keys(grouped)) {
    const problems = grouped[subject]
    
    // Sort by order if it exists, otherwise by title
    problems.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      return a.title.localeCompare(b.title)
    })
    
    console.log(`Processing ${subject} (${problems.length} problems)`)
    
    for (let i = 0; i < problems.length; i++) {
      const prob = problems[i]
      
      const moduleNum = `Module ${Math.floor(i / 6) + 1}`
      
      const updateMask = '?updateMask.fieldPaths=module&updateMask.fieldPaths=order'
      const patchBody = {
        fields: {
          module: { stringValue: moduleNum },
          order: { integerValue: i }
        }
      }
      
      await fetch(`https://firestore.googleapis.com/v1/${prob.docName}${updateMask}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchBody)
      })
      
      totalUpdated++
    }
  }
  
  console.log(`Successfully assigned modules to ${totalUpdated} problems.`)
}

assignModules().catch(console.error)
