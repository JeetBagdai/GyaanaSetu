import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
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

console.log('Project:', PROJECT)
// Initialize Admin SDK with the correct project ID (mock default credentials if running via emulate)
// Note: We need FIREBASE_AUTH_EMULATOR_HOST or actual credentials. Assuming the user's setup works via default application credentials or open DB.
// Wait, actually, the user used REST API in the `populate_codeit.mjs` script! Let's do the same REST API deletion to avoid needing firebase-admin credentials!

async function trimProblems() {
  const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/coding_problems`
  
  console.log('Fetching all coding problems...')
  
  let allProblems = []
  let nextPageToken = ''
  
  do {
      let fetchUrl = queryUrl + '?pageSize=300'
      if (nextPageToken) fetchUrl += `&pageToken=${nextPageToken}`
      
      const res = await fetch(fetchUrl)
      if (!res.ok) {
          console.error('Failed to fetch', await res.text())
          return
      }
      const data = await res.json()
      if (data.documents) {
          allProblems.push(...data.documents)
      }
      nextPageToken = data.nextPageToken
  } while (nextPageToken)

  
  if (allProblems.length === 0) {
    console.log('No coding problems found.')
    return
  }

  // Group by subject
  const grouped = {}
  allProblems.forEach(doc => {
    const subj = doc.fields.subject?.stringValue || 'Unknown'
    const order = doc.fields.order?.integerValue || 0
    if (!grouped[subj]) grouped[subj] = []
    grouped[subj].push({ name: doc.name, order: parseInt(order) })
  })

  let deletedCount = 0

  for (const [subject, problems] of Object.entries(grouped)) {
    if (problems.length > 30) {
      console.log(`\nSubject: ${subject} has ${problems.length} problems. Trimming to 30...`)
      
      // Sort by order ascending
      problems.sort((a, b) => a.order - b.order)
      
      const excess = problems.slice(30)
      
      for (const prob of excess) {
         const deleteUrl = `https://firestore.googleapis.com/v1/${prob.name}`
         const res = await fetch(deleteUrl, { method: 'DELETE' })
         if (res.ok) {
             deletedCount++
         } else {
             console.error(`Failed to delete ${prob.name}`)
         }
      }
      console.log(`Deleted ${excess.length} excess problems for ${subject}.`)
    } else {
      console.log(`Subject: ${subject} has ${problems.length} problems (OK).`)
    }
  }

  console.log(`\nDone. Trimmed a total of ${deletedCount} problems.`)
}

trimProblems().catch(console.error)
