import {
  ref,
  uploadBytes,
  getDownloadURL,
  connectStorageEmulator,
  type FirebaseStorage,
} from 'firebase/storage';
import type { IStorageService } from '~/core/contracts';

const EMULATOR_HOST = '127.0.0.1';
const EMULATOR_PORT = 9199;

function createFilePathRef(
  storageInstance: FirebaseStorage,
  userId: string,
  fileName: string
) {
  const path = `detectedPersons/${userId}/${fileName}`;
  return ref(storageInstance, path);
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const { storage } = nuxtApp.$firebase as { storage: FirebaseStorage };

  if (import.meta.client && location.hostname === 'localhost') {
    console.log(
      `🔌 Connecting Storage to emulator: ${EMULATOR_HOST}:${EMULATOR_PORT} for project ${storage.app.options.projectId}`
    );
    // connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORT);
  }

  const uploadImage: IStorageService['uploadImage'] = async (
    userId,
    imageData
  ) => {
    const fileBaseName = `detection_${Date.now()}`;
    let uploadedFileLocation = '';

    try {
      const fileRef = createFilePathRef(storage, userId, fileBaseName);

      const uploadResult = await uploadBytes(fileRef, imageData);

      uploadedFileLocation = uploadResult.ref.fullPath;
    } catch (error) {
      console.error('❌ Error uploading image:', error);

      throw error;
    }

    return uploadedFileLocation;
  };

  const getImageUrl: IStorageService['getImageUrl'] = async (
    userId,
    imageName
  ) => {
    const fileRef = createFilePathRef(storage, userId, imageName);

    return getDownloadURL(fileRef);
  };

  const firebaseStorage: IStorageService = {
    uploadImage,
    getImageUrl,
  };

  return {
    provide: {
      firebaseStorage,
    },
  };
});
