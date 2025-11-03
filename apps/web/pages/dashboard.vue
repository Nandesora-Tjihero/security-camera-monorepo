<template>
  <section
    ref="demos"
    class="max-w-[640px] mx-auto max-sm:px-5 py-5"
  >
    <BaseHeading class="">Security Camera</BaseHeading>
    <h2 class="text-xl my-10">Welcome!</h2>
    <UButton
      v-if="!subscription"
      class="mb-10"
      to="/upgrade"
      >Upgrade</UButton
    >
    <FeatureDetectionPersonDetected v-else />
  </section>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });

  const { subscription } = useUser();
</script>
