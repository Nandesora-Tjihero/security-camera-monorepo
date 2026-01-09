

const { updateTokens } = require('./utils/onTokensDocChange');
exports.updateTokens = updateTokens;

const { onDetectionImageUploaded } = require('./utils/onObjectFinalized');
exports.onDetectionImageUploaded = onDetectionImageUploaded;

const { removeFromFirestore } = require('./utils/onUserDelete');
exports.removeFromFirestore = removeFromFirestore;
