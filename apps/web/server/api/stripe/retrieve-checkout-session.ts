import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const { checkoutSessionId } = await readBody(event);

  if (!checkoutSessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing checkoutSessionId',
    });
  }

  const stripe = new Stripe(useRuntimeConfig().stripeApiKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
      expand: ['subscription'],
    });
    return session as Stripe.Response<Stripe.Checkout.Session>;
  } catch (error) {
    console.error('Error retrieving checkout session', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error retrieving checkout session',
    });
  }
});
