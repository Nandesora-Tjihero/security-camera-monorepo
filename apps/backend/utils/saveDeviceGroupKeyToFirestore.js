async function saveDeviceGroupKeyToFirestore(db, userId, notification_key) {
  const docRef = db.collection('users').doc(userId);
  try {
    await docRef.update({ notification_key });
    console.log('Device group key saved to Firestore');
  } catch (e) {
    console.error('Error saving device group key to Firestore: ' + e.code);
  }
}

module.exports = saveDeviceGroupKeyToFirestore;
