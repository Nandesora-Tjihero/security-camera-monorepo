<template>
  <UContainer class="max-w-2xl flex flex-col gap-5 py-10 h-2/3">
    <BaseHeading class="mb-5">Subscription Successful</BaseHeading>
    <div class="">
      <p>Thank you for subscribing to our service.</p>
      <p>You will receive notifications when a person is detected.</p>
    </div>

    <NuxtLink
      to="/dashboard"
      class="text-sky-500 underline"
    >
      Go To Dashboard
    </NuxtLink>
  </UContainer>
</template>

<script setup lang="ts">
  // definePageMeta({
  //   middleware: ['auth'],
  // });

  import type Stripe from 'stripe';

  import {
    getDatabaseService,
    getBillingService,
  } from '~~/layers/01-base/app/utils/services';

  const { setSubscription, user } = useUser();

  const billingService = getBillingService();
  const databaseService = getDatabaseService();

  onMounted(async () => {
    const router = useRoute();
    const checkoutSessionId = router.query.session_id as string;

    try {
      if (!checkoutSessionId) throw new Error('No checkout session ID found');

      const subscriptionSession = (await billingService.retrieveCheckoutSession(
        checkoutSessionId
      )) as Stripe.Response<Stripe.Checkout.Session>;
      console;

      if (subscriptionSession && user.value) {
        await databaseService.saveCustomerId(
          user.value!.uid,
          subscriptionSession.customer as string
        );

        if (
          typeof subscriptionSession.subscription === 'object' &&
          subscriptionSession.subscription !== null
        ) {
          await databaseService.saveUserSubscription(user.value!.uid, {
            id: subscriptionSession.id,
            status: subscriptionSession.subscription.status,
            current_period_end: subscriptionSession.expires_at,
            price_id:
              subscriptionSession?.subscription?.items?.data[0]?.price.id,
          });
        }

        const subscriptionInDB = await databaseService.getSubscription(
          user.value!.uid
        );
        setSubscription(subscriptionInDB);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  });
</script>
