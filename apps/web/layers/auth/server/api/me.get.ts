export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event);

  const isServer = !headers['x-forwarded-for'] && !headers['referer'];

  if (isServer) {
    console.log('🔒 Request from server-side');
  } else {
    console.log('🌐 Request from browser');
  }

  const user = await getServerUser(event);

  if (!user) {
    setResponseStatus(event, 401);
    return { user: null };
  }

  // You can return minimal safe info here
  return {
    user: {
      uid: user.uid,
      email: user.email,
      name: user.name || user.displayName || null,
    },
  };
});
