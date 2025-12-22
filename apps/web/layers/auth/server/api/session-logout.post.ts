export default defineEventHandler((event) => {
  deleteCookie(event, 'id_token');

  return { status: 'success' };
});
