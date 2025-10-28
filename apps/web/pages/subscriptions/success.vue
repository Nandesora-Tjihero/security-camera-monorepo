<template>
  <UContainer>
    <BaseHeading class="mb-5">Subscription Successful</BaseHeading>
    <div class="flex flex-col items-center gap-5">
      <p>Thank you for subscribing to our service.</p>
      <p>You will receive notifications when a person is detected.</p>
    </div>

    <UButton
      @click="navigateTo('/dashboard')"
      class="!bg-black dark:!bg-white"
      >Go to Dashboard</UButton
    >
  </UContainer>
</template>

<script setup lang="ts">
  import type Stripe from 'stripe';
  import { getDatabaseService } from '~/utils/services/getDatabaseService';
  import { getBillingService } from '~/utils/services/getBillingService';
  const canGoToDashboard = ref(false);

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
            price_id: subscriptionSession.subscription.items.data[0].price.id,
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
