import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync('./gyaanasetu-bnmit-firebase-adminsdk-fbsvc-b711e15f59.json', 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function run() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('role', '==', 'teacher').limit(2).get();
  
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data().subjects);
  });
}

run().catch(console.error);
