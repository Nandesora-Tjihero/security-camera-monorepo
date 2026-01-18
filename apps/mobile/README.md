# Security Camera Mobile App

This is the companion mobile application for the Security Camera system, built with **NativeScript-Vue**. It allows users to receive real-time notifications when intrusions are detected and view event history.

> 📘 **Documentation**: For a detailed breakdown of the requirements and specifications that drove this implementation, see [PROJECT_REQUIREMENTS.md](../../PROJECT_REQUIREMENTS.md).

## 📱 Features

- **Push Notifications**: Receive immediate alerts via Firebase Cloud Messaging (FCM) when the camera detects a person.
- **Event History**: View a timeline of detected events and snapshots (stored in Firestore/Storage).
- **Authentication**: Secure login via Firebase Auth (Google Sign-In).

## 🛠 Tech Stack

- **Framework**: [NativeScript-Vue](https://nativescript-vue.org/) (Vue 3)
- **Styling**: TailwindCSS
- **Backend Services**:
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Cloud Messaging (FCM)
  - Firebase Storage

## 🚀 Getting Started

### Prerequisites

1. **Firebase**: You must have a Firebase project set up with an Android app registered.
2. **NativeScript**: Ensure your environment is set up for NativeScript development. Follow the [official guide](https://docs.nativescript.org/setup/).

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run on Android:
   ```bash
   ns run android
   ```
   > _Note: iOS support has not been fully tested yet._

## 📂 Project Structure

- `src/`: Source code
  - `components/`: UI components
  - `pages/`: Application screens
  - `composables/`: Vue Composables
  - `core/`: Core logic and services
- `nativescript.config.ts`: NativeScript configuration
