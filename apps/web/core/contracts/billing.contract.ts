export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'unpaid'
  | 'paused';

export interface ISubscription {
  id: string;
  status: SubscriptionStatus;
  current_period_end: number;
  price_id: string;
}

export type SubscriptionAction = 'subscribe' | 'free-trial';

export interface IBillingService {
  createCheckoutSession(
    priceLookupKey: string,
    userEmail: string,
    action: string
  ): Promise<void>;

  //   createStripeCustomer(email: string, name: string): Promise<string>;

  retrieveCheckoutSession(checkoutSessionId: string): Promise<any>;
}
