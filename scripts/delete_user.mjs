import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./gyaanasetu-bnmit-firebase-adminsdk-fbsvc-b711e15f59.json', 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function deleteUserByEmail(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(user.uid);
    console.log(`Successfully deleted user from Firebase Auth: ${email}`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`User with email ${email} not found in Firebase Auth.`);
    } else {
      console.error('Error deleting user:', error);
    }
  }
}

deleteUserByEmail('jeetbagdai1606@gmail.com');
