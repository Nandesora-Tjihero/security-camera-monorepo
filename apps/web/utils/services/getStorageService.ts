import type { IStorageService } from '~/core/contracts/storage.contract';

export const getStorageService = (): IStorageService => {
  return useNuxtApp().$firebaseStorage as IStorageService;
};
