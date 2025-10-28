export default defineEventHandler(async (event) => {
  const { userId, imgURL } = await readBody(event);

  try {
    // Notify the user of detection
    await sendNotificationRequestWithUserIdAndImgURL(userId, imgURL);

    return {
      status: 200,
      body: 'Notification sent',
    };
  } catch (e: any) {
    console.error('Error sending message to FCM backend: ' + e.code);
    return new Response('Error sending message to FCM backend: ' + e.code, {
      status: 500,
    });
  }
});
