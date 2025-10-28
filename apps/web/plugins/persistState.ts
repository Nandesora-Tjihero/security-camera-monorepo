import nuxtStorage from 'nuxt-storage';

export default defineNuxtPlugin(() => {
  const { user, setUser } = useUser(); // your composable that exposes user.user.value

  // restore on client load
  try {
    const raw = nuxtStorage.localStorage.getData('user');

    if (raw) {
      setUser(JSON.parse(raw));

      console.log('Restoring user from localStorage', raw);
    }
  } catch (e) {
    console.warn('Failed to restore user from localStorage', e);
  }

  // persist changes
  watch(
    () => user.value,
    (val) => {
      try {
        if (val) nuxtStorage.localStorage.setData('user', JSON.stringify(val));
        else nuxtStorage.localStorage.removeItem('user');
      } catch (e) {
        console.warn('Failed to persist user to localStorage', e);
      }
    },
    { deep: true }
  );
});
