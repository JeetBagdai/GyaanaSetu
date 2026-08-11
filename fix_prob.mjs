import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const projectMatch = env.match(/VITE_FIREBASE_PROJECT_ID=(.*)/);
const PROJECT = projectMatch ? projectMatch[1].trim() : 'gyaanasetu-bnmit';

async function fixProblem() {
  const id = 'prob-sem3-add';
  const body = {
    fields: {
      semester: { integerValue: 3 }, // MUST be integer to match query
      subjectCode: { stringValue: 'Computer Organization and Architecture' } // Uses actual subject name
    }
  };

  const updateMasks = Object.keys(body.fields).map(key => `updateMask.fieldPaths=${key}`).join('&');
  const updateUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/coding_problems/${id}?${updateMasks}`;

  const patchRes = await fetch(updateUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (patchRes.ok) {
    console.log(`Successfully fixed problem ${id}`);
  } else {
    console.error(`Failed to fix ${id}`, await patchRes.text());
  }
}

fixProblem();
