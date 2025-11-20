import { getDatabaseService } from '#layers/01-base/app/utils/services';

export default defineNuxtPlugin(async (nuxtApp) => {
  const databaseService = getDatabaseService();

  const { setUser, clearUser } = useUser();
  const currentUser = await useNuxtApp().$firebase.getCurrentUser();

  if (!currentUser) {
    clearUser();
    return;
  }

  const userFromDB = await databaseService.getUserById(currentUser.uid);
  setUser(userFromDB);
});
