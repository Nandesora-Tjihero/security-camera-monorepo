import type { ButtonProps } from '#ui/types';

interface ButtonConfig {
  text: string;
  action: 'free-trial' | 'sign-in' | 'upgrade' | 'dashboard';
  variant: ButtonProps['variant'];
}

export const useSubscription = () => {
  const { user } = useUser();
  const state = useSubscriptionState();

  onMounted(() => {
    try {
      const hasTriedFreeTrialLocalStorage = localStorage.getItem(
        'SCHasTriedFreeTrial',
      );

      state.hasTriedFreeTrial.value = Boolean(hasTriedFreeTrialLocalStorage);
    } catch (error) {}
  });

  const markFreeTrialSeen = () => {
    localStorage.setItem('SCHasTriedFreeTrial', 'true');
    state.hasTriedFreeTrial.value = true;
  };

  const hasActiveSubscription = computed(() => {
    return (
      state.subscription.value?.status === 'active' ||
      (state.subscription.value?.status === 'trialing' &&
        !currentPeriodEndDateIsPast.value)
    );
  });

  const currentPeriodEndDateIsPast = computed(() => {
    if (!state.subscription.value?.current_period_end) {
      return false;
    }
    const currentPeriodEnd = new Date(
      state.subscription.value.current_period_end * 1000,
    );
    const now = new Date();
    return currentPeriodEnd < now;
  });

  const buttonConfig: ComputedRef<ButtonConfig> = computed(() => {
    if (user.value) {
      if (hasActiveSubscription.value) {
        return {
          text: 'Ir al panel',
          action: 'dashboard',
          variant: 'solid',
        };
      }
      return {
        text: 'Mejorar ahora',
        action: 'upgrade',
        variant: 'solid',
      };
    }

    if (!state.hasTriedFreeTrial.value) {
      return {
        text: 'Probar 14 días gratis',
        action: 'free-trial',
        variant: 'solid',
      };
    }

    return {
      text: 'Iniciar sesión',
      action: 'sign-in',
      variant: 'solid',
    };
  });

  return {
    ...state,
    buttonConfig,
    markFreeTrialSeen,
    hasActiveSubscription,
  };
};
