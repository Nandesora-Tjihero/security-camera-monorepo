import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  const customer = await stripe.customers.search({
    query: email,
    expand: ['subscriptions.data'],
  });
  const customerSubscriptions = customer.data[0].subscriptions?.data;
  console.log(
    'Customer search result',
    customer.data[0].subscriptions?.data.length
  );
  if (!customerSubscriptions) {
    return new Response('No subscriptions found', { status: 404 });
  }
  return new Response(JSON.stringify(customerSubscriptions[0]), {
    status: 200,
  });
});
