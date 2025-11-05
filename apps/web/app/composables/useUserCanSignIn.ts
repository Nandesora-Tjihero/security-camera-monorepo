import { useUser } from '~~/layers/auth/app/composables/useUser';
export const useUserCanSignIn = () => {
  const canSignIn = ref(false);
  const { user } = useUser();

  onMounted(() => {
    const isCameraSupported = !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    );

    canSignIn.value =
      isCameraSupported &&
      !!model.value &&
      !user.value &&
      useRoute().path !== '/auth';

    console.log('canSignIn:', canSignIn.value);
    watch(
      () => model.value,
      (newModel) => {
        const isCameraSupported = !!(
          navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        );

        canSignIn.value =
          isCameraSupported &&
          !!newModel &&
          !user.value &&
          useRoute().path !== '/auth';
        console.log('canSignIn (model watch):', canSignIn.value);
      }
    );
  });

  return {
    canSignIn,
  };
};
