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
  // You can add logic here to choose the appropriate service (e.g., based on environment)
  return billingStripe(); // Or return billingStub() for local development
}
