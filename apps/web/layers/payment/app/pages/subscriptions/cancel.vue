<template>
  <UContainer class="max-w-2xl flex flex-col gap-5 py-10 h-2/3">
    <BaseHeading class="mb-5">Subscription Cancelled</BaseHeading>
    <div>
      <p>Your subscription has been cancelled.</p>
      <p>You will no longer receive notifications when a person is detected.</p>
    </div>

    <NuxtLink
      to="/"
      class="text-sky-500 underline"
    >
      Go Home
    </NuxtLink>
  </UContainer>
</template>
<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
  });
</script>
