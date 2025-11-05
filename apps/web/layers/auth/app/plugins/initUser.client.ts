import { getAuthService } from '~~/layers/01-base/app/utils/services';

export default defineNuxtPlugin(async (nuxtApp) => {
  const authService = getAuthService();

  const { setUser } = useUser();

  const currentUser = await useNuxtApp().$firebase.getCurrentUser();

  if (currentUser) setUser(authService.convertToScUser(currentUser));
});
