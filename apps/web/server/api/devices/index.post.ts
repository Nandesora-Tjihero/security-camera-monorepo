export default defineEventHandler(async (event) => {
  const { userId, registrationTokens } = await readBody(event);

  const data = await fetch('https://fcm.googleapis.com/fcm/notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      access_token_auth: 'true',
    },
    body: JSON.stringify({
      operation: 'create',
      notification_key_name: `appUser-${userId}`,
      registration_ids: registrationTokens,
    }),
  }).catch((error) => {
    console.error('Error creating device group:', error);
  });

  return {
    status: 200,
    body: data,
  };
});
