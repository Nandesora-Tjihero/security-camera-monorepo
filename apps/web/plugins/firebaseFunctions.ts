import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
export default defineNuxtPlugin((nuxApp) => {
  const app = nuxApp.$firebase as {
    app: ReturnType<typeof import('firebase/app').getApp>;
  };

  const functions = getFunctions(app.app);
  // connectFunctionsEmulator(functions, '127.0.0.1', 5001);
});
