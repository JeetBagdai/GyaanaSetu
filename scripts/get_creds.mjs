import fs from 'fs';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(fs.readFileSync('./gyaanasetu-bnmit-firebase-adminsdk-fbsvc-b711e15f59.json', 'utf8'));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

async function getCreds() {
  const usersRef = db.collection('users');
  
  const teachers = await usersRef.where('role', '==', 'teacher').get();
  console.log('--- TEACHERS ---');
  teachers.forEach(doc => {
    console.log(`Email: ${doc.data().email}`);
  });

  const admins = await usersRef.where('role', '==', 'admin').get();
  console.log('\n--- ADMINS ---');
  admins.forEach(doc => {
    console.log(`Email: ${doc.data().email}`);
  });
  
  // Note: We can't fetch passwords from Firebase Auth.
  // The user might just want the emails. 
}

getCreds();
