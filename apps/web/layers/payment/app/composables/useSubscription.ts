import type { ButtonVariant } from '#ui/types';

interface ButtonConfig {
  text: string;
  action: 'free-trial' | 'sign-in' | 'upgrade' | 'dashboard';
  variant: ButtonVariant;
}

export const useSubscription = () => {
  const { user, subscription } = useUser();

  const hasTriedFreeTrial = ref(false);

  onMounted(() => {
    // Check localStorage
    try {
      const hasTriedFreeTrialLocalStorage = localStorage.getItem(
        'SCHasTriedFreeTrial'
      );

      hasTriedFreeTrial.value = Boolean(hasTriedFreeTrialLocalStorage);
    } catch (error) {}
  });

  const markFreeTrialSeen = () => {
    localStorage.setItem('SCHasTriedFreeTrial', 'true');
  };

  const hasActiveSubscription = computed(() => {
    return (
      subscription.value?.status === 'active' ||
      (subscription.value?.status === 'trialing' &&
        !currentPeriodEndDateIsPast.value)
    );
  });

  const currentPeriodEndDateIsPast = computed(() => {
    if (!subscription.value?.current_period_end) {
      return false;
    }
    const currentPeriodEnd = new Date(
      subscription.value.current_period_end * 1000
    );
    const now = new Date();
    return currentPeriodEnd < now;
  });

  const getButtonConfig: ComputedRef<ButtonConfig> = computed(() => {
    if (!user.value && hasTriedFreeTrial.value !== true) {
      return {
        text: 'Try for 14 days free',
        action: 'free-trial',
        variant: 'solid',
      };
    } else if (!user.value) {
      return {
        text: 'Sign In',
        action: 'sign-in',
        variant: 'solid',
      };
    } else if (user.value && !hasActiveSubscription.value) {
      return {
        text: 'Upgrade Now',
        action: 'upgrade',
        variant: 'solid',
      };
    } else {
      return {
        text: 'Go to Dashboard',
        action: 'dashboard',
        variant: 'solid',
      };
    }
  });

  return {
    hasTriedFreeTrial: readonly(hasTriedFreeTrial),
    getButtonConfig: readonly(getButtonConfig),
    markFreeTrialSeen,
    hasActiveSubscription: readonly(hasActiveSubscription),
  };
};
