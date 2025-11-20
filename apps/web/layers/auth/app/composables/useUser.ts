import type { ISubscription } from '#shared/core/contracts';
import type { ScUser } from '#shared/core/models';
import { browser } from '@tensorflow/tfjs-core';

export const useUser = () => {
  const user = useState<ScUser | null>('user', () => null);

  const setUser = (newUser: ScUser | null) => {
    user.value = newUser;
  };

  const clearUser = () => {
    user.value = null;
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

  const hasNotificationDevice = useState<boolean>(
    'hasNotificationDevice',
    () => (user.value?.tokens?.length ?? 0) > 0
  );

  const setHasNotificationDevice = (device: boolean) => {
    hasNotificationDevice.value = device;
  };
  return {
    user: user,
    canMonitor,
    setUser,
    clearUser,
    hasValidPlan,
    subscription,
    setSubscription,
    hasNotificationDevice,
    setHasNotificationDevice,
  };
};
