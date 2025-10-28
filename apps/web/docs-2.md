# Security Camera App Design

This app will have the following characteristics.

## Support

Does the user browser support the **camera** or the **ML model**? Check this before you allow the user to log in.

## Start Monitoring

1. Enable camera
2. Pass the camera stream data to the model for [detection](#detection)

## Detection

if person `detected`: - send the image to storage bucket or - send to server so the server handles storage - notifyTheUser on the device of interest

## Notification

- user should register their phone that receives the notification
- when storage bucket receives detection image, the bucket `onObjectFinalize` triggers and send notifications via [FCM](https://firebase.google.com/docs/cloud-messaging)

#### Register the notification phone

On the mobile app:

- The user logs in
- On login, the app registers the device token with the backend to receive notifications

## User Access Control

A user can use the monitoring service if:

- is authenticated
- has valid plan( on free trial or subscription)
- has a monitoring device. if no monitoring device, user should [Register the notification phone](#register-the-notification-phone) one before they can activate monitoring

## Flow

### 1. Landing page

- if no active subscription, show `Get started for free` button and hide `Login` button. Else,just show `Login` button

### 2. Authenticate

On authentication success:

**Check subscription**

- if first-time user, create free trial. Auto-upgrade? No. to avoid asking for Bank Card at first visit.
  if free trial expires, show `Free trail expired. Add payment method to use the service`,

**Check notification device**

- if none, tell the user to add one from the mobile app and `poll`/SSE the backend for if the device is set. As soon as there is a device notification device, allow initiation of monitoring
