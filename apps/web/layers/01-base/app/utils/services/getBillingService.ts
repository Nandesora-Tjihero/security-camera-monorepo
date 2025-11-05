import type { IBillingService } from '~/core/contracts/billing.contract';

export const getBillingService = (): IBillingService => {
  const { $stubBillingClient, $stripe } = useNuxtApp();
  return $stripe as IBillingService;
};
