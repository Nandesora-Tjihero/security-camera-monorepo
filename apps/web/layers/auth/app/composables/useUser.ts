import type { ISubscription } from "#shared/core/contracts";
import type { ScUser } from "#shared/core/models";

export const useUser = () => {
  const state = useUserState();
  const subState = useSubscriptionState();

  const setUser = (newUser: ScUser | null) => {
    state.user.value = newUser;
  };

  const setSubscription = (newSubscription: ISubscription | null) => {
    subState.subscription.value = newSubscription;
  };

  const setHasNotificationDevice = (device: boolean) => {
    state.hasNotificationDevice.value = device;
  };

  const clearUser = () => {
    state.user.value = null;
    subState.subscription.value = null;
  };

  const hasValidPlan = computed(() => {
    return (
      subState.subscription.value?.status === "trialing" ||
      subState.subscription.value?.status === "active"
    );
  });

  const canMonitor = computed(
    () =>
      state.user.value &&
      state.hasNotificationDevice.value &&
      hasValidPlan.value,
  );

  watch(
    () => state.user.value,
    (newUser) => {
      if (newUser) {
        setHasNotificationDevice((newUser.tokens?.length ?? 0) > 0);
      }
    },
  );

  return {
    ...state,
    ...subState,
    hasValidPlan,
    canMonitor,
    setUser,
    setSubscription,
    setHasNotificationDevice,
    clearUser,
  };
};
