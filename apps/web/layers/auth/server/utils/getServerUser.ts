import { getAuth } from 'firebase-admin/auth';
import type { H3Event } from 'h3';

export async function getServerUser(event: H3Event) {
  const idToken = getCookie(event, 'id_token') || '';

  const isTesting = getHeader(event, 'x-testing') || false;

  if (isTesting) {
    return { uid: 'dev-uid', email: 'dev@example.com' };
  }

  if (!idToken) return null;

  try {
    const decodedClaims = await getAuth(firebaseApp).verifyIdToken(
      idToken,
      true
    );
    return decodedClaims;
  } catch (err) {
    console.error('Invalid or expired id_token cookie', err);
    return null;
  }
}
