<template>
  <section
    ref="demos"
    class="max-w-[640px] mx-auto max-sm:px-5 py-5"
  >
    <BaseHeading
      class=""
      data-testid="dashboard-title"
      >Security Camera</BaseHeading
    >
    <h2 class="text-xl my-10">Welcome!</h2>
    <UButton
      data-test="upgrade-button"
      v-if="hasActiveSubscription === false"
      class="mb-10"
      to="/upgrade"
      >Upgrade</UButton
    >
    <FeatureDetectionPersonDetected v-else />
  </section>
</template>

<script setup lang="ts">
  // definePageMeta({
  //   middleware: ['auth'],
  // });

  const { subscription, setSubscription, user } = useUser();

  const { hasActiveSubscription } = useSubscription();

  import { getDatabaseService } from '~~/layers/01-base/app/utils/services';

  import FeatureDetectionPersonDetected from '~~/layers/detection/app/components/PersonDetected.vue';

  const databaseService = getDatabaseService();
  onMounted(async () => {
    if (user.value) {
      const sub = await databaseService.getSubscription(user.value?.uid);
      setSubscription(sub);
    }
  });
</script>
