import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

import { afterAll, beforeAll, beforeEach, describe, test } from 'vitest';

// import dotEnv from 'dotenv';
// dotEnv.config();

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  const firestoreRulesPath = path.join(__dirname, '../../firestore.rules');
  // Initialize the test environment
  testEnv = await initializeTestEnvironment({
    projectId: process.env.NUXT_PUBLIC_PROJECT_ID, // Replace with your project ID
    firestore: {
      rules: fs.readFileSync(firestoreRulesPath, 'utf8'), // Replace with the path to your firestore.rules file
    },
  });
});

afterAll(async () => {
  // Clean up the test environment
  await testEnv.cleanup();
});

describe('Firestore Security Rules Tests', () => {
  beforeEach(async () => {
    // Clear data between tests
    await testEnv.clearFirestore();
  });

  test('authenticated user can write to their own document', async () => {
    // 1. Arrange: Suppose we have an authenticated user with uid 'alice'
    const alice = testEnv.authenticatedContext('alice', {
      /* optional token options */
    });

    // 2. Act: Try to write to a document in the 'users' collection with uid not matching 'alice'
    const writeResponse = setDoc(doc(alice.firestore(), '/users/bob'), {
      name: 'Alice',
    });

    // 3. Assert: The write should fail
    await assertFails(writeResponse);
  });

  test('unauthenticated user cannot read any document', async () => {
    // 1. Arrange: Create an unauthenticated context
    const unauthenticated = testEnv.unauthenticatedContext();

    // 2. Act: Try to read a document in the 'users' collection
    const readResponse = getDoc(
      doc(unauthenticated.firestore(), '/users/someUserId')
    );

    // 3. Assert: The read should fail
    await assertFails(readResponse);
  });

  // Add more test cases here
});
