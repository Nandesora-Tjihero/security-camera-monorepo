const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.removeFromFirestore = functions
    .region('europe-west1')
    .auth.user()
    .onDelete(async (user) => {
        console.log('User deleted:', user.uid);

        try {
            await admin.firestore().collection('users').doc(user.uid).delete();
            console.log(`Deleted Firestore document for user ${user.uid}`);
        } catch (error) {
            console.error('Error deleting Firestore document:', error);
        }
    });