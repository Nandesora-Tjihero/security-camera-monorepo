<!-- ---
title: Security Camera App Development Process
---

# Security Camera App Development Process

## What is it about?

A user has a spare phone that they can use as a security camera. They use this phone to monitor their home following these steps:

## Requirements and Features

To start monitoring, click the Start Monitoring button and send “monitoring” to backend
If the state is “monitoring”, show the “Notify me” button to start getting notifications.
When the “Notify me“ button is clicked, ask for permission to notify.
Determine when to set “monitoring”: when the app is in the foreground?

## Pricing

The app is free to use for 14 days. After that, the user needs to subscribe to a paid plan to continue using the app.
The paid plan costs €11.99/month.

### Subscriptions steps

1. User lands on the landing page.
   The landing page has the following: - "Start a free trial" button
   when user clicks on the button, the following happens: 1. user is taken to the authentication page - "Login" button
   when user clicks on the button, the following happens: 1. user is taken to the authentication page - "Sign up" button
   when user sign-ups successfully, the following happens:
   1. if user doesn't exist, save user details to the database
   2. if they login from "Start a free trial", create a free trial subscription
   3. On successful subscription creation, save user customer id from Stripe to the Firestore.
      1. Then, redirect to the dashboard page passing the saved customer id as prop to Home component. 2. Once on the dashboard page, use the customer id to fetch the user's subscription details from Stripe. Save the subscription details to Firestore. 3. If the user has an active subscription, disable the "Start monitoring" button.
      2. User signs in from the "Subscribe" button, the following happens on Home page:
   4. Get customer id from Firestore.
      if customer id exists, get the user's subscription details. If user is currently on free trial, upgrade to a paid subscription.?? 2. Otherwise, make a call to Stripe to create a subscription. 1. On successful subscription creation, save user customer id from Stripe to the Firestore. 2. Then, redirect to the dashboard page passing the saved customer id as prop to Home component. 3. Once on the dashboard page, use the customer id to fetch the user's subscription details from Stripe. Save the subscription details to Firestore. 4. If the user has an active subscription, disable the "Start monitoring" button.
2. User signs in from the "Login" button, the following happens on Home page:
   1. Get customer id from Firestore.
      if customer id exists, get the user's subscription details and enable/disable the "Start monitoring" button based on the subscription status. Otherwise, show the "Start a free trial" and "Subscribe" buttons.

## Hosting

To deploy the app to Firebase Hosting, you need to enable the following APIs on GCP:

- Cloud Functions
  - assign the "Cloud Functions Admin" role to the `<github_actions_service_account>@<project_id>.iam.gserviceaccount.com` service account to deploy new HTTPS functions.
    Do that by going the "IAM" page on the GCP console.
  1.  Then, click on the pencil icon for the service account.
  2.  then, on the "Edit access to "YOUR_FIREBASE_APP_NAME" page, click on the "Add another role" button.
  3.  Then, search for "Cloud Functions Admin" and select it.
  4.  Then, click on the "Save" button.
  - assign the "Service Account User" role to the `<github_actions_service_account>@<project_id>.iam.gserviceaccount.com` service account to deploy new HTTPS functions.
    Do that by going the "IAM" page on the GCP console.
- Artifact Registry
- Cloud Build
- Cloud Run Admin
- Eventarc API

* Also, make sure you have the following installed in your project:

- firebase-functions

* On the GCP, grant your Compute Engine instance the Secret Manager Secret Accessor role to access the secrets stored in Secret Manager:
  `Security` > `Secret Manager` > `Secret Accessor`
  Which service account needed to be granted the Secret Manager Secret Accessor role?

  gcloud run services add-iam-policy-binding security-camera \
  --region europe-west4 \
  --member="allUsers" \
  --role="roles/run.invoker"

## Updating isMonitoring state on all user devices in real-time on Firestore

To update the `isMonitoring` state on all user devices in real-time, you need to:

1. Create a Firestore document to store the state of the app.
2. When a user clicks the `Start Monitoring` button, update the `isMonitoring` field in the Firestore document to `true`.
3. When the `isMonitoring` field is updated, use Firestore triggers to send a notification to all user devices.
4. When a user receives the notification, update the UI to reflect the new state of the app. -->
