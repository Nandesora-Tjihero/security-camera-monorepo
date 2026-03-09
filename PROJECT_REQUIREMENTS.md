# Project Requirements & Specifications: Security Camera System

## 1. Executive Summary

**See also:** [Impact & Service Design](./IMPACT_AND_SERVICE_DESIGN.md) for Personas, KPIs, and SLA definitions.

The goal of this project is to democratize home security by transforming existing devices (laptops, old phones) into intelligent security cameras using web technologies. The system utilizes edge computing (browser-based AI) to detect intruders and leverages serverless cloud infrastructure for reliable storage and notifications.

## 2. User Stories

- **As a Homeowner**, I want to use my old laptop as a security camera so that I don't have to buy expensive hardware.
- **As a User**, I want to be notified immediately on my phone when a person is detected in my home.
- **As a Privacy-Conscious User**, I want video processing to happen locally on my device, sending only detected event images to the cloud.
- **As a Subscriber**, I want to manage my billing plan securely.

## 3. Functional Requirements

### 3.1. Camera & Detection (Web Client)

- **FR-01**: The web application must access the device's camera stream via standard Web APIs.
- **FR-02**: The system must run an object detection model (TensorFlow.js / COCO-SSD) locally in the browser.
- **FR-03**: The system must filter detections to identify specific classes of interest (e.g., "person") with a configurable confidence threshold.
- **FR-04**: Upon detection, the system must capture a still frame (snapshot).
- **FR-05**: The captured snapshot must be uploaded to a secure cloud storage bucket (Firebase Storage) with metadata (timestamp, user ID).

### 3.2. Backend & Processing (Serverless)

- **FR-06**: A background process must be triggered automatically when a new image is finalized in the storage bucket.
- **FR-07**: The backend must resolve the user associated with the image upload.
- **FR-08**: The backend must dispatch a push notification to the user's primary mobile device via FCM (Firebase Cloud Messaging).

### 3.3. Authentication & Access Control

- **FR-09**: Users must authenticate using a secure provider (Firebase Auth).
- **FR-10**: Users must only be able to access their own images and event history (Firestore Security Rules).

### 3.4. Monetization (Stripe)

- **FR-11**: The system must support subscription tiers (e.g., Free Trial, Premium).
- **FR-12**: Access to historical data or advanced features should be gated based on subscription status.

## 4. Technical Specifications

### 4.1. Architecture

- **Pattern**: Event-Driven Serverless Architecture.
- **Frontend**: Nuxt 4 (Vue 3) SPA for the camera interface.
- **Backend**: Firebase Cloud Functions v2 for event handling.
- **Database**: Firestore for user metadata and event logs.
- **Storage**: Cloud Storage for Firebase for event snapshots.
- **AI/ML**: Client-side execution using TensorFlow.js (WebGL backend).

### 4.2. Data Flow

1. **Detection**: `Browser` -> `TensorFlow.js` -> `Detection Event`
2. **Ingestion**: `Browser` -> `Firebase Storage` (Image upload)
3. **Trigger**: `Firebase Storage` -> `Cloud Function (onObjectFinalized)`
4. **Notification**: `Cloud Function` -> `FCM` -> `Mobile App`

### 4.3. Interface Guidelines

- The web interface must be responsive and capable of running in full-screen mode.
- Visual feedback must be provided when detection occurs (e.g., bounding boxes).
- Dark mode should be the default to reduce screen glare during monitoring.
