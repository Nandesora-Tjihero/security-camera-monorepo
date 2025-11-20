export default defineEventHandler((event) => {
  deleteCookie(event, 'session');

  return { status: 'success' };
});
