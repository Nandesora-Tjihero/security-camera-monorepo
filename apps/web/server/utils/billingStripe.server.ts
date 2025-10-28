import Stripe from 'stripe';
import { IBillingService } from './getBillingService.server';

const DOMAIN = 'http://localhost:3000';

export function billingStripe(): IBillingService {
  const stripeClient = new Stripe(useRuntimeConfig().stripeApiKey);

  async function createCheckoutSession(
    lookupKey: string,
    email: string,
    action: string
  ): Promise<string> {
    try {
      const prices = await stripeClient.prices.list({
        lookup_keys: [lookupKey],
        expand: ['data.product'],
      });

      // create a new session for the price
      const session = await stripeClient.checkout.sessions.create({
        customer_email: email,
        expand: ['subscription'],
        mode: 'subscription',
        success_url: `${DOMAIN}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${DOMAIN}/subscriptions/cancel`,
        line_items: [
          {
            price: prices.data[0].id,
            quantity: 1,
          },
        ],
        subscription_data:
          action !== 'free-trial'
            ? undefined
            : {
                trial_settings: {
                  end_behavior: {
                    missing_payment_method: 'cancel',
                  },
                },
                trial_period_days: 14,
                // 14 days from now
              },
        automatic_tax: { enabled: true },
        payment_method_collection: 'if_required',
      });

      if (!session.url) {
        throw new Error('Stripe session URL is null');
      }
      return session.url;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      throw error;
    }
  }

  async function retrieveCheckoutSession(checkoutSessionId: string) {
    try {
      return await stripeClient.checkout.sessions.retrieve(checkoutSessionId, {
        expand: ['subscription'],
      });
    } catch (error) {
      console.error('Error retrieving checkout session', error);
    }
  }

  return {
    createCheckoutSession,
    retrieveCheckoutSession,
  };
}
