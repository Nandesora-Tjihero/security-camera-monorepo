import type { ISubscription } from '#shared/core/contracts';
import type { ScUser } from '#shared/core/models';

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
  };
};
