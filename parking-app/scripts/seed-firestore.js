/**
 * Eenmalig seed-script: maakt de 10 parkeerplekken aan in Firestore.
 *
 * Gebruik:
 *   1. npm install -g firebase-tools
 *   2. Stel GOOGLE_APPLICATION_CREDENTIALS in (service account JSON van Firebase Console)
 *      export GOOGLE_APPLICATION_CREDENTIALS="/pad/naar/serviceAccount.json"
 *   3. Pas PROJECT_ID hieronder aan
 *   4. node scripts/seed-firestore.js
 */

const admin = require('firebase-admin');

const PROJECT_ID = 'jouw-project-id'; // TODO: aanpassen

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: PROJECT_ID,
});

const db = admin.firestore();

const spots = [
  // Garage Boven: 4 plekken
  ...Array.from({ length: 4 }, (_, i) => ({
    spotId: `boven_0${i + 1}`,
    garage: 'boven',
    spotNumber: i + 1,
    status: 'free',
    occupiedBy: null,
    occupiedByName: null,
    occupiedSince: null,
    expectedUntil: null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })),
  // Garage Binnen: 6 plekken
  ...Array.from({ length: 6 }, (_, i) => ({
    spotId: `binnen_0${i + 1}`,
    garage: 'binnen',
    spotNumber: i + 1,
    status: 'free',
    occupiedBy: null,
    occupiedByName: null,
    occupiedSince: null,
    expectedUntil: null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })),
];

async function seed() {
  const batch = db.batch();
  for (const spot of spots) {
    const ref = db.collection('spots').doc(spot.spotId);
    batch.set(ref, spot);
  }
  await batch.commit();
  console.log(`✓ ${spots.length} parkeerplekken aangemaakt in Firestore.`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed mislukt:', err);
  process.exit(1);
});
