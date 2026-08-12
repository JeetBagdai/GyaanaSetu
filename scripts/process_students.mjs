import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync('./gyaanasetu-bnmit-firebase-adminsdk-fbsvc-b711e15f59.json', 'utf8'));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();
const auth = admin.auth();

async function deleteAllStudents() {
  console.log('Fetching existing student accounts...');
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('role', '==', 'student').get();
  
  if (snapshot.empty) {
    console.log('No existing students found.');
    return;
  }

  const uids = [];
  snapshot.forEach(doc => {
    uids.push(doc.id);
  });

  console.log(`Found ${uids.length} student records. Deleting...`);
  
  // Delete from Firestore in batches
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Delete from Auth in chunks of 1000
  for (let i = 0; i < uids.length; i += 1000) {
    const chunk = uids.slice(i, i + 1000);
    await auth.deleteUsers(chunk);
  }
  
  console.log('Successfully deleted all existing student accounts.');
}

async function run() {
  try {
    await deleteAllStudents();

    console.log('Reading temp_sem5.txt...');
    const text = fs.readFileSync('temp_sem5.txt', 'utf8');

    // Example: 1BG24AI001AIABHINAV JAI VATHSAVT K JAYARAM 20240842202025-02-04
    const regex = /(1BG\d{2}([A-Z]{2})\d{3})\2([\s\S]*?)\d{10}2025-02-04/g;
    
    let students = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const usn = match[1];
      const branch = match[2];
      // nameAndFather contains "ABHINAV JAI VATHSAV T K JAYARAM"
      // Since it's hard to split Name from Father Name reliably without a fixed delimiter,
      // we'll make a best effort or just extract what we need. 
      // The user wants email ID as the first word in their name.
      const namePart = match[3].trim().replace(/\n/g, ' ');
      // First word of namePart is the first name
      const firstName = namePart.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');

      if (branch === 'AI') {
        students.push({
          usn,
          branch,
          fullName: namePart, // We will just store this, though it contains father name too. Wait, we can split it better if needed, but we only strictly need the first word.
          firstName
        });
      }
    }

    console.log(`Parsed ${students.length} AI students from PDF.`);

    // Sort alphabetically by full name
    students.sort((a, b) => a.fullName.localeCompare(b.fullName));

    const emailSet = new Set();
    const accountsToCreate = [];

    // Assign sections and prepare account data
    students.forEach((student, index) => {
      // First 60 -> Section A, rest -> Section B
      const section = index < 60 ? 'A' : 'B';
      const classId = `AIML-SEM5-${section}`;

      // Handle email collisions
      let emailPrefix = student.firstName;
      let email = `${emailPrefix}@gmail.com`;

      if (emailSet.has(email)) {
        const last3 = student.usn.slice(-3);
        email = `${emailPrefix}${last3}@gmail.com`;
      }
      emailSet.add(email);

      // Password: First letter of name (lowercase) + last 3 of USN + "00" to meet Firebase 6-char limit
      const firstLetter = student.firstName.charAt(0);
      const last3 = student.usn.slice(-3);
      const password = `${firstLetter}${last3}00`;

      // Name extraction: let's try to just take the first two words as their name if it's too long, or just keep it simple.
      // But we will use "fullName" for the displayName, even if it has Father's name. Actually, let's take first two words.
      const nameWords = student.fullName.split(' ');
      const displayName = nameWords.length >= 2 ? `${nameWords[0]} ${nameWords[1]}` : nameWords[0];

      accountsToCreate.push({
        email,
        password,
        displayName: displayName,
        usn: student.usn,
        classId,
        semester: 5,
        department: 'AIML',
        school: 'BNM Institute of Technology',
        role: 'student'
      });
    });

    // Create Test Accounts
    for (let sem = 3; sem <= 8; sem++) {
      accountsToCreate.push({
        email: `testsem${sem}@gmail.com`,
        password: `testsem${sem}`,
        displayName: `Test Student Sem ${sem}`,
        usn: `1BG24AI99${sem}`,
        classId: `AIML-SEM${sem}-A`,
        semester: sem,
        department: 'AIML',
        school: 'BNM Institute of Technology',
        role: 'student'
      });
    }

    console.log(`Creating ${accountsToCreate.length} accounts...`);

    let successCount = 0;
    for (const acc of accountsToCreate) {
      try {
        const userRecord = await auth.createUser({
          email: acc.email,
          password: acc.password,
          displayName: acc.displayName
        });

        await db.collection('users').doc(userRecord.uid).set({
          uid: userRecord.uid,
          name: acc.displayName,
          email: acc.email,
          role: acc.role,
          department: acc.department,
          school: acc.school,
          semester: acc.semester,
          usn: acc.usn,
          classId: acc.classId,
          createdAt: new Date().toISOString()
        });

        successCount++;
        if (successCount % 20 === 0) console.log(`Created ${successCount}...`);
      } catch (err) {
        console.error(`Error creating account for ${acc.email}:`, err.message);
      }
    }

    console.log(`Done! Created ${successCount} accounts.`);

  } catch (err) {
    console.error('Script failed:', err);
  }
}

run();
