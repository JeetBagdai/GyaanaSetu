import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./gyaanasetu-bnmit-firebase-adminsdk-fbsvc-b711e15f59.json', 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function checkUserFace(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const db = admin.firestore();
    const doc = await db.collection('users').doc(user.uid).get();
    
    if (doc.exists) {
      const data = doc.data();
      console.log('User Profile found:');
      console.log(`Email: ${data.email}`);
      console.log(`faceRegistered: ${data.faceRegistered}`);
      if (data.faceDescriptor) {
        console.log(`faceDescriptor exists and has length: ${data.faceDescriptor.length}`);
        console.log('Full Array:');
        console.log(JSON.stringify(data.faceDescriptor));
      } else {
        console.log('faceDescriptor is missing!');
      }
    } else {
      console.log('Firestore document not found for this user.');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

checkUserFace('jeetbagdai1606@gmail.com');
