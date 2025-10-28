export default defineEventHandler(async (event) => {
  const { email, name } = await readBody(event);
});
