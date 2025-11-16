import dotEnv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let test;
import { assert } from 'vitest';

describe('Cloud Functions', () => {
    let myFunctions;

    before(async () => {
        // Require index.js and save the exports inside a namespace called myFunctions.
        // This includes our cloud functions, which can now be accessed at myFunctions.makeUppercase
        // and myFunctions.addMessage
        // load .env explicitly from project root (adjust path if needed)
        dotEnv.config({ path: path.join(__dirname, '..', '..', '.env') });

        // dynamic import so dotenv runs first (ESM imports are hoisted otherwise)
        const firebaseFunctionsTest = (await import('firebase-functions-test')).default;
        test = firebaseFunctionsTest({
            projectId: process.env.NUXT_PUBLIC_PROJECT_ID,
            databaseURL: `https://${process.env.NUXT_PUBLIC_PROJECT_ID}.firebaseio.com`,
            storageBucket: process.env.STORAGE_BUCKET
        }, path.join(__dirname, '../../../security-camera-a413e-firebase-adminsdk-fbsvc-9239d5d459.json'));


        myFunctions = await import('../index.js');
    });

    after(() => {
        // Do cleanup tasks.
        test.cleanup();
    });

    describe('onDetectionImageUploaded', () => {
        it('should process the uploaded image', async () => {
            const userId = 'testUser123';

            const objectMetadata = {
                name: `detections/${userId}/file_1731170800000.jpg`,
                bucket: process.env.STORAGE_BUCKET,
                contentType: 'image/jpeg',
                timeCreated: new Date().toISOString(),
                updated: new Date().toISOString(),
            };
            const wrapped = test.wrap(myFunctions.onDetectionImageUploaded);
            await wrapped({ data: objectMetadata });
        });
    });
});




