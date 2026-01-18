# Security Camera Backend (Firebase Functions)

This directory contains the serverless backend logic for the Security Camera application, built using Firebase Cloud Functions.

## 🏗 Architecture

The backend operates on an event-driven architecture. It does not maintain a persistent server but instead responds to specific triggers from the Firebase ecosystem.

### Core Functions

| Function Name       | Trigger Type         | Description                                                                                                                   |
| ------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `onObjectFinalized` | Storage (Background) | Triggered when a camera device uploads a snapshot. It processes the image metadata and sends a push notification to the user. |

## 🚀 Key Workflows

### 1. Notification Pipeline

When the web app detects a person:

1. It uploads the image to `gs://<bucket>/users/<uid>/...`
2. **`onObjectFinalized`** function fires.
3. It derives the `userId` from the file path.
4. It looks up the user's FCM tokens in Firestore.
5. It sends a message via Firebase Cloud Messaging (FCM) to the user's devices.

## 🛠 Local Development

To run the backend logic locally, use the Firebase Emulators.

For detailed setup instructions, refer to the [official Firebase Emulators documentation](https://firebase.google.com/docs/emulator-suite).

```bash
# Start the emulators
npm run serve
```

This will spin up:

- Cloud Functions Emulator
- Firestore Emulator
- Pub/Sub Emulator

## 🧪 Testing

This project uses `mocha` and `chai` for unit and integration testing.

```bash
npm run test
```

## 📂 File Structure

- `index.js`: Main entry point exporting all functions.
- `utils/`: Helper utilities for business logic.
- `firebase.json`: Emulator configuration.
