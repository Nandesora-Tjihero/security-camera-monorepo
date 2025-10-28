// 1. Destructure imports for clarity
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

interface IFirebaseService {
  app: FirebaseApp;
  auth: ReturnType<typeof getAuth>;
  firestore: ReturnType<typeof getFirestore>;
  storage: ReturnType<typeof getStorage>;
  getCurrentUser: () => Promise<User>;
}

const initFirebaseApp = () => {
  const runtimeConfig = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: runtimeConfig.public.apiKey,
    authDomain: runtimeConfig.public.authDomain,
    projectId: runtimeConfig.public.projectId,
    storageBucket: runtimeConfig.public.storageBucket,
    messagingSenderId: runtimeConfig.public.messagingSenderId,
    appId: runtimeConfig.public.appId,
    measurementId: runtimeConfig.public.measurementId,
  };

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

export default defineNuxtPlugin((/* nuxtApp */) => {
  const app = initFirebaseApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  const getCurrentUser = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        getAuth(),
        (user) => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  };

  return {
    provide: {
      firebase: {
        app,
        auth,
        firestore,
        storage,
        getCurrentUser,
      } as IFirebaseService,
    },
  };
});
