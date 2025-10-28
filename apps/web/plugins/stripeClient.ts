import Stripe from 'stripe';

export default defineNuxtPlugin((nuxtApp) => {
  async function createCheckoutSession(
    priceLookupKey: string,
    email: string,
    action: string
  ) {
    console.log('Creating checkout session with:', {
      priceLookupKey,
      email,
      action,
    });
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lookupKey: priceLookupKey,
          email,
          action,
        }),
      });

      const data = await response.text();
      // Redirect to the session URL

      window.location.href = data;

      console.log('Response from create-checkout-session:', data);
    } catch (error) {
      console.error(
        'Error creating checkout session in createStripeCheckoutSession',
        error
      );
    }
  }

  async function createStripeCustomer(email: string, name: string) {
    try {
      const response = await fetch('/api/stripe/customers', {
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
      const response = await fetch('/api/stripe/retrieve-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkoutSessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve checkout session');
      }

      return (await response.json()) as Stripe.Response<Stripe.Checkout.Session>;
    } catch (error) {
      console.error('Error retrieving checkout session', error);
    }
  };
  return {
    provide: {
      stripe: {
        createCheckoutSession,
        createStripeCustomer,
        retrieveCheckoutSession,
      },
    },
  };
});
