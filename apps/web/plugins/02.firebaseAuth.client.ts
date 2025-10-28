import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as logOut,
  onAuthStateChanged,
  type User,
  connectAuthEmulator,
} from 'firebase/auth';
import type { ScUser } from '~/core/models/user.model';

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

  async function signOut() {
    try {
      await logOut(auth);
    } catch (error) {
      console.error('Error signing out', error);

      throw error;
    }
  }

  function convertToScUser(user: any): ScUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }

  return {
    provide: {
      firebaseAuth: {
        signInWithGoogle,
        convertToScUser,
        signOut,
      },
    },
  };
});
