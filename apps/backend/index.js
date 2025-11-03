const { initializeApp, getApps } = require('firebase-admin/app');

if (!getApps().length) {
    initializeApp();
}

const { updateTokens } = require('./utils/onTokensDocChange');
exports.updateTokens = updateTokens;

const { onDetectionImageUploaded } = require('./utils/onObjectFinalized');
exports.onDetectionImageUploaded = onDetectionImageUploaded;

const { removeFromFirestore } = require('./utils/onUserDelete');
exports.removeFromFirestore = removeFromFirestore;
