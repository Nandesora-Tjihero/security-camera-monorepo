import type { ISubscription } from '~/core/contracts';
import type { ScUser } from '~/core/models/user.model';
import { model } from '~/utils/detection/tfjs';

export const useUser = () => {
  const user = useState<ScUser | null>('user', () => null);

  const setUser = (newUser: ScUser | null) => {
    user.value = newUser;
  };

  watch(
    () => user.value,
    (newUser) => {
      if (newUser) {
        if (newUser.tokens && newUser.tokens.length > 0) {
          setHasNotificationDevice(true);
        } else {
          setHasNotificationDevice(false);
        }
      }
    }
  );

  const subscription = useState<ISubscription | null>(
    'subscription',
    () => null
  );
  const setSubscription = (newSubscription: ISubscription | null) => {
    subscription.value = newSubscription;
  };

  const hasValidPlan = computed(() => {
    return (
      subscription.value?.status === 'trialing' ||
      subscription.value?.status === 'active'
    );
  });

  const canMonitor = computed(
    () => user.value && hasNotificationDevice.value && hasValidPlan.value
  );

  const canSignIn = ref(false);

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

  const hasNotificationDevice = useState<boolean>(
    'hasNotificationDevice',
    () => (user.value?.tokens?.length ?? 0) > 0
  );
  const setHasNotificationDevice = (device: boolean) => {
    console.log('Setting hasNotificationDevice to', device);
    hasNotificationDevice.value = device;
  };

  return {
    user: user,
    canMonitor,
    setUser,
    hasValidPlan,
    subscription,
    setSubscription,
    hasNotificationDevice,
    setHasNotificationDevice,
    canSignIn,
  };
};
