export const useUserCanSignIn = () => {
  const canSignIn = ref(false);
  const { user } = useUser();

  if (import.meta.client) {
    onMounted(() => {
      console.log('dfd', navigator.mediaDevices);
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
          console.log(
            'canSignIn (model watch):',
            canSignIn.value,
            isCameraSupported
          );
        }
      );
    });
  }

  return {
    canSignIn,
  };
};
