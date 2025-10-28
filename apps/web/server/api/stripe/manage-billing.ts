import Stripe from "stripe";

export default defineEventHandler(async (event) => {
  const { customer } = await readBody(event);
  const stripe = new Stripe("");
  const return_url = "DOMAIN/subscriptions.html";
  // create customer portal session
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer,
      return_url,
    });
    return Response.redirect(portalSession.url, 303);
  } catch (error) {
    console.error("Error creating portal session:", error);
    return new Response("Error creating portal session", { status: 500 });
  }
});
