export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('Received notification:', body);

  try {
    // Logic to handle the notification
    notifyUserViaFCM(body.userId, body.imgURL);
  } catch (error) {
    console.error('Error notifying user:', error);
  } finally {
    return { status: 'OK', statusCode: 200 };
  }
});
