export interface SubscriptionSession {
  id: string;
  object: string;
  customer: string;
  subscription: {
    id: string;
    status:
      | 'active'
      | 'trialing'
      | 'canceled'
      | 'incomplete'
      | 'incomplete_expired'
      | 'past_due'
      | 'unpaid';
    price_id: string;
    current_period_end: number;
  };
}
export default defineNuxtPlugin((nuxtApp) => {
  async function createCheckoutSession(
    priceLookupKey: string,
    email: string,
    action: string
  ) {
    try {
      const BASE_URL = 'http://localhost:3000'; // Replace with your actual base URL

      const body = await new Promise<Response>((resolve) => {
        setTimeout(() => {
          const response = new Response(
            JSON.stringify({
              url: `${BASE_URL}/subscriptions/success?session_id=cs_test_sessionId`,
            })
          );

          resolve(response);
        }, 1000);
      });

      const response = await body.json();
      return response;
    } catch (error) {
      console.error(
        'Error creating checkout session in createStripeCheckoutSession',
        error
      );
    }
  }

  async function createStripeCustomer(email: string, name: string) {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name,
        }),
      });
    } catch (error) {
      console.error('Error creating a customer', error);
    }
  }

  const retrieveCheckoutSession = async (checkoutSessionId: string) => {
    try {
      const checkoutSession = await new Promise<SubscriptionSession>(
        (resolve) => {
          setTimeout(() => {
            resolve({
              id: checkoutSessionId,
              object: 'checkout.session',
              customer: 'cus_testCustomerId',
              subscription: {
                id: 'sub_testSubscriptionId',
                status: 'active',
                price_id: 'price_testPriceId',
                current_period_end:
                  Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
              },
            });
          }, 1000);
        }
      );
      return checkoutSession;
    } catch (error) {
      console.error('Error retrieving checkout session', error);
    }
  };

  return {
    provide: {
      stubBillingClient: {
        createCheckoutSession,
        createStripeCustomer,
        retrieveCheckoutSession,
      },
    },
  };
});
