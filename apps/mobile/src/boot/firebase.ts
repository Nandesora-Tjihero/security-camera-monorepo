import { firebaseUtils } from '../utils/firebaseHelpers';

export const initFirebase = async () => {
  await firebaseUtils.initializeApp();
};
