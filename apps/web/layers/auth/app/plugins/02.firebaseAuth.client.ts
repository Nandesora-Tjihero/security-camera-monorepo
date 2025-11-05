import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as logOut,
  onAuthStateChanged,
  type User,
  connectAuthEmulator,
  getAuth,
} from 'firebase/auth';
import type { IAuthService } from '#shared/core/contracts';
import type { ScUser } from '#shared/core/models';

export default defineNuxtPlugin((nuxtApp) => {
  const { auth } = nuxtApp.$firebase as {
    auth: ReturnType<typeof import('firebase/auth').getAuth>;
  };
  // connectAuthEmulator(auth, 'http://127.0.0.1:9099');

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      return result.user as User;
    } catch (error) {
      console.error('Error signing in with Google', error);

      throw error;
    }
  }

  function convertToScUser(user: User): ScUser {
    return {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
    };
  }

  async function signOut() {
    try {
      await logOut(auth);
    } catch (error) {
      console.error('Error signing out', error);

      throw error;
    }
  }

  const firebaseAuth: IAuthService = {
    signInWithGoogle,
    convertToScUser,
    signOut,
  };

  return {
    provide: {
      firebaseAuth,
    },
  };
});
