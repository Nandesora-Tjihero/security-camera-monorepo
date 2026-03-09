// TODO: ensure this function works
const functions = require('firebase-functions');
const { db } = require('../firebase');

const { defineString } = require('firebase-functions/params');

const REGION = defineString('USER_DELETE_REGION');

exports.removeFromFirestore = functions
    .region(REGION)
    .auth.user()
    .onDelete(async (user) => {
        console.log('User deleted:', user.uid);

        try {
            await db.recursiveDelete(db.collection('users').doc(user.uid));
            console.log(`Deleted Firestore document and subcollections for user ${user.uid}`);
        } catch (error) {
            console.error('Error deleting Firestore document:', error);
        }
    });