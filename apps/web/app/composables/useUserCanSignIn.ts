import { useUser } from '~~/layers/auth/app/composables/useUser';
export const useUserCanSignIn = () => {
  const canSignIn = ref(false);
  const { user } = useUser();

  if (import.meta.client) {
    onMounted(() => {
      const isCameraSupported = !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      );

      canSignIn.value =
        isCameraSupported &&
        !!model.value &&
        !user.value &&
        useRoute().path !== '/auth';

      watchEffect(() => {
        const isCameraSupported = !!(
          navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        );

        canSignIn.value =
          isCameraSupported &&
          !!model.value &&
          !user.value &&
          useRoute().path !== '/auth';
      });
    });
  }

  return {
    canSignIn,
  };
};
