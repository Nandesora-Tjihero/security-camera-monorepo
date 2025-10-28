import { getBillingService } from '~/server/utils/getBillingService.server';

export default defineEventHandler(async (event) => {
  const { lookupKey, email, action } = await readBody(event);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.node.req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  setHeaders(event, headers);

  try {
    // Inject the billing service using the factory
    const billingService = getBillingService();
    const sessionURL = await billingService.createCheckoutSession(
      lookupKey,
      email,
      action
    );

    return new Response(sessionURL as string, { status: 303, headers });
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    return new Response(`Error creating session ${error}`, { status: 500 });
  }
});
