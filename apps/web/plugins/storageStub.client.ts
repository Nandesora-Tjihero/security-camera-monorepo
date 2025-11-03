import type { IStorageService } from '~/core/contracts/storage.contract';

export default defineNuxtPlugin((nuxtApp) => {
  const uploadImage = async (userId: string, blob: Blob) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // GCP bucket URL placeholder
        resolve(
          `https://storage.googleapis.com/fake-bucket/${userId}/image-${Date.now()}.jpg`
        );
      }, 500);
    });
  };

  const getImageUrl = async (userId: string, imageName: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`https://via.placeholder.com/150?text=${imageName}`);
      }, 500);
    });
  };

  nuxtApp.provide('storageStubService', {
    uploadImage,
    getImageUrl,
  } as IStorageService);
});
