export default defineEventHandler(async (event) => {
  const user = await getServerUser(event);

  if (!user && event.path.startsWith('/dashboard')) {
    return sendRedirect(event, '/auth', 302);
  }

  if (user && (event.path.startsWith('/auth') || event.path.endsWith('/'))) {
    return sendRedirect(event, '/dashboard', 302);
  }

  event.context.user = user;
});
