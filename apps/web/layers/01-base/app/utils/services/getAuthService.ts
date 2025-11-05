import type { IAuthService } from '~/core/contracts/auth.contract';

export const getAuthService = (): IAuthService => {
  // To be swapped with stub or other auth implementations that conform to AuthService
  const firebase = useNuxtApp().$firebaseAuth as IAuthService;
  return firebase;
};
