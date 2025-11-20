import { getAuth } from 'firebase-admin/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const idToken = body.idToken;

  // Create session cookie valid for, e.g., 7 days
  const expiresIn = 7 * 24 * 60 * 60 * 1000;

  const sessionCookie = await getAuth(firebaseApp).createSessionCookie(
    idToken,
    {
      expiresIn,
    }
  );

  setCookie(event, 'session', sessionCookie, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    maxAge: expiresIn / 1000,
    path: '/',
    sameSite: 'lax',
  });

  return { status: 'success' };
});
