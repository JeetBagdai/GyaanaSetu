// functions/src/utils/index.js
// Shared Firebase Admin + GCS setup

const admin  = require('firebase-admin')
const { Storage } = require('@google-cloud/storage')

// Init Firebase Admin once — must specify projectId to match Firebase Auth token audience
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'gyanasetu-cca',
  })
}

const db      = admin.firestore()
const storage = new Storage()
const bucket  = storage.bucket(process.env.GCS_BUCKET || 'gyanasetu-ncert')

// Verify Firebase ID token from Authorization header
async function verifyToken(req) {
  const authHeader = req.headers['authorization'] || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) throw new Error('Unauthorized: no token')
  const decoded = await admin.auth().verifyIdToken(token)
  return decoded
}

module.exports = { admin, db, storage, bucket, verifyToken }

