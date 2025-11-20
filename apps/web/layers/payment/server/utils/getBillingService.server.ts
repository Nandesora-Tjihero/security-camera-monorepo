export interface IBillingService {
  createCheckoutSession(
    priceLookupKey: string,
    userEmail: string,
    action: string
  ): Promise<string>;

  //   createStripeCustomer(email: string, name: string): Promise<string>;

  retrieveCheckoutSession(checkoutSessionId: string): Promise<any>;
}

export function getBillingService(): IBillingService {
  return billingStripe();
}
