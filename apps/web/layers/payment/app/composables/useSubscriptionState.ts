import type { ISubscription } from "#shared/core/contracts";

export const useSubscriptionState = () => {
  return {
    hasTriedFreeTrial: useState<boolean>("hasTriedFreeTrial", () => false),
    subscription: useState<ISubscription | null>("subscription", () => null),
  };
};
