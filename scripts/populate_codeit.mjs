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

const GENERATED_DIR = path.join(__dirname, '..', 'generated_problems')

import { getPracticalSubjects } from '../src/data/learningContent.js'

async function uploadProblems() {
  if (!fs.existsSync(GENERATED_DIR)) {
    console.error('Generated problems directory not found!')
    return
  }

  const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'))
  if (files.length === 0) {
    console.log('No JSON files found in generated_problems/')
    return
  }

  let totalUploaded = 0

  for (const file of files) {
    console.log(`Processing ${file}...`)
    
    // Parse filename to get semester and subject
    // Example: sem3_ObjectOrientedProgrammingusingJavaLab.json
    const match = file.match(/^sem(\d+)_(.+)\.json$/)
    if (!match) {
      console.warn(`Skipping ${file} - invalid filename format`)
      continue
    }

    const semester = parseInt(match[1])
    const practicalSubjects = getPracticalSubjects(semester)
    const exactSubject = practicalSubjects.find(s => s.replace(/[^a-zA-Z0-9]/g, '') === match[2].replace(/[^a-zA-Z0-9]/g, '')) || match[2]

    
    // Read problems
    const content = fs.readFileSync(path.join(GENERATED_DIR, file), 'utf8')
    let problems = []
    try {
      problems = JSON.parse(content)
    } catch (e) {
      console.error(`Failed to parse JSON for ${file}:`, e.message)
      continue
    }

    if (!Array.isArray(problems)) {
      console.error(`Expected an array of problems in ${file}`)
      continue
    }

    console.log(`Found ${problems.length} problems for ${file}`)

    let order = 1
    for (const prob of problems) {
      const id = `prob-sem${semester}-${Date.now()}-${Math.random().toString(36).substring(7)}`
      
      const sampleTestCases = (prob.sampleTestCases || []).map(tc => ({
        mapValue: {
          fields: {
            input: { stringValue: tc.input || '' },
            output: { stringValue: tc.output || '' }
          }
        }
      }))

      // Prepare starter code safely
      const starterCode = prob.starterCode || {}
      
      const body = {
        fields: {
          title: { stringValue: prob.title || 'Untitled Problem' },
          description: { stringValue: prob.description || '' },
          difficulty: { stringValue: prob.difficulty || 'Medium' },
          semester: { integerValue: semester },
          subject: { stringValue: exactSubject },
          subjectCode: { stringValue: match[2] }, // Store exact code/name used in filename
          proctored: { booleanValue: true }, // Set to true by default!
          order: { integerValue: order++ },
          inputFormat: { stringValue: prob.inputFormat || '' },
          outputFormat: { stringValue: prob.outputFormat || '' },
          note: { stringValue: prob.note || '' },
          sampleTestCases: {
            arrayValue: {
              values: sampleTestCases
            }
          },
          starterCode: {
            mapValue: {
              fields: {
                python: { stringValue: starterCode.python || '' },
                java: { stringValue: starterCode.java || '' },
                cpp: { stringValue: starterCode.cpp || '' }
              }
            }
          }
        }
      }

      const updateUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/coding_problems/${id}`

      const patchRes = await fetch(updateUrl, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      
      if (patchRes.ok) {
        totalUploaded++
      } else {
        console.error(`Failed to create ${id}:`, await patchRes.text())
      }
    }
    
    console.log(`Finished processing ${file}.`)
  }
  
  console.log(`\nSuccessfully uploaded a total of ${totalUploaded} problems.`)
}

uploadProblems().catch(console.error)
