import { Stripe } from 'stripe';
const stripe = new Stripe(useRuntimeConfig().stripeApiKey);

export default defineEventHandler(async (event) => {
  let body = await readRawBody(event);
  const stripeSignature = event.node.req.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body as string | Buffer,
      stripeSignature as string,
      useRuntimeConfig().stripeWebhookSecret
    );
  } catch (err: any) {
    return new Response('Webhook signature verification failed', {
      status: 400,
    });
  }

  let subscription;

  switch (stripeEvent.type) {
    case 'customer.created':
      await handleNewCustomer(stripeEvent);

      break;
    case 'customer.subscription.trial_will_end':
      subscription = stripeEvent.data.object;

      break;
    case 'customer.subscription.updated':
      subscription = stripeEvent.data.object;

      break;
    case 'customer.subscription.deleted':
      subscription = stripeEvent.data.object;

      break;
    case 'customer.subscription.created':
      subscription = stripeEvent.data.object;
      await handleSubscriptionUpdate(stripeEvent);
      break;
    case 'entitlements.active_entitlement_summary.updated':
      subscription = stripeEvent.data.object;

      break;
    case 'customer.subscription.resumed':
      subscription = stripeEvent.data.object;

      // Update the subscription status in the Firestore database
      break;
    case 'customer.subscription.paused':
      subscription = stripeEvent.data.object;

      // Update the subscription status in the Firestore database
      await handleSubscriptionUpdate(stripeEvent);
      break;
    default:
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

async function handleSubscriptionUpdate(stripeEvent: Stripe.Event) {
  // 1. get customer email from stripeEvent

  const subscription = stripeEvent.data.object as Stripe.Subscription;
  const customerId = getUserEmailFromEvent(stripeEvent);
  console.log('Customer ID:', stripeEvent);
  if (!customerId) return;

  await updateSubscriptionInDB(customerId, subscription);
}

const getUserEmailFromEvent = (stripeEvent: Stripe.Event) => {
  const customer = stripeEvent.data.object as Stripe.Customer;
  return customer.email ?? null;
};

const handleNewCustomer = async (stripeEvent: Stripe.Event) => {
  const customer = stripeEvent.data.object as Stripe.Customer;
  if (!customer.email) return;

  // Check if user already exists
  const userId = await getUserIdByEmail(customer.email);
  console.log('User ID:', userId);
  if (userId) return;

  // Create new user in the database
  await getDatabaseService().saveCustomerId(customer.id, customer.id);
};

const getUserIdByEmail = async (email: string) => {
  const user = await getDatabaseService().getUserByEmail(email);
  return user ? user.uid : null;
};

const getSubscriptionFromDB = async (userId: string) => {
  const subscription = await getDatabaseService().getSubscription(userId);
  return subscription ?? null;
};

const updateSubscriptionInDB = async (
  email: string,
  subscription: Stripe.Subscription
) => {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) return;

    const subscriptionFromDB = userId
      ? await getSubscriptionFromDB(userId)
      : null;
    if (!userId || !subscriptionFromDB) return;

    // 3. update the subscription in the DB
    await getDatabaseService().saveUserSubscription(userId, {
      ...subscriptionFromDB,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Error updating subscription in DB:', error);
  }
};
