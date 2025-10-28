<template>
  <div>
    <BaseHeading class="mb-5">Subscriptions</BaseHeading>
    <UButton
      label="Manage Subscription"
      @click="manageSubscription"
    />
    <!-- <stripe-pricing-table
      pricing-table-id="prctbl_1PxSPzRpYtm6aJjBW373pn33"
      publishable-key="pk_test_51Px7beRpYtm6aJjB2ykYxNxUvHTGFUEa8uwtB7ddRcogwUZeoDQC7MPzE2msd6cYvbdPjuyi6c1W4wzAqsII8YAY00v8HPSwEW"
    >
    </stripe-pricing-table> -->
    <form
      action="/api/stripe/create-checkout-session"
      method="POST"
    >
      <!-- Add a hidden field with the lookup_key of your Price -->
      <input
        type="hidden"
        name="lookup_key"
        value="Security_Camera-fd2ded4"
      />
      <button
        id="checkout-and-portal-button"
        type="submit"
      >
        Checkout
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
  definePageMeta({
    // middleware: ['auth'],
  });
  onMounted(() => {
    // 1. check user subscription status
    // 2. if user is subscribed, show manage subscription button
    // 3. if subscription is paused, show "Your free trial has ended. Provide payment details to continue." message.
    // then show "Manage Subscription" button
    // when they click on "Manage Subscription" button, call the "createCheckoutSession" function
    // on success, call the "resumeSubscription" endpoint
  });
  const manageSubscription = async () => {
    // Get customer ID for current user from the database
    try {
      const res = await fetch('/api/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: 'CUSTOMER_ID_FROM_DATABASE',
        }),
      });
    } catch (error) {
      console.error('Error managing subscription', error);
    }
  };
</script>
