const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const { getStorage } = require('firebase-admin/storage');

if (!getApps().length) {
    initializeApp();
}

const db = getFirestore();
const messaging = getMessaging();
const storage = getStorage();

module.exports = {
    db,
    messaging,
    storage
};
