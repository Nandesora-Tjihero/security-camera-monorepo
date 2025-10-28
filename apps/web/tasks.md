# Project tasks

## TODO

- Create Storage bucket for detection images
- Create notification(`new-detection`) that, when a detection image is uploaded, Storage uses to notify Pub/Sub
- When Pub/Sub receives `new-detection`, it calls `/api/notify-user` with the image data
- notify user with FCM in `/api/notify-user`
- handle user device id tokens, cache device token for user
- Polish subscription with stripe

## Testing

- Add vitest testing
  - mock the billing service, write tests and to pass them, pretend the stripe implementation does not exist and use the `billingStub`. When ready to build for production, delete the `stubs`
  -
