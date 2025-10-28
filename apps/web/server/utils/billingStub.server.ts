export function billingStub() {
  const createCheckoutSession = async (
    priceLookupKey: string,
    userEmail: string,
    action: string
  ) => {
    console.log(
      'Stub: createCheckoutSession called with',
      priceLookupKey,
      userEmail,
      action
    );

    // Return a mock session object
    return 'http://localhost:3000/subscriptions/success?session_id=cs_test_mockedSessionId';
  };

  const retrieveCheckoutSession = async (checkoutSessionId: string) => {
    console.log('Stub: retrieveCheckoutSession called with', checkoutSessionId);

    // Return a mock subscription session object
    return {
      id: checkoutSessionId,
      object: 'checkout.session',
      customer: 'cus_testMockedCustomerId',
      subscription: {
        id: 'sub_testMockedSubscriptionId',
        object: 'subscription',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
        price_id: 'price_testMockedPriceId',
      },
    };
  };

  return {
    createCheckoutSession,
    retrieveCheckoutSession,
  };
}
