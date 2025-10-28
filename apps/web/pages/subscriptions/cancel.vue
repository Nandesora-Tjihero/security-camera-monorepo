<template>
  <div>
    <BaseHeading class="mb-5">Subscription Cancelled</BaseHeading>
    <div class="flex flex-col items-center gap-5">
      <p>Your subscription has been cancelled.</p>
      <p>You will no longer receive notifications when a person is detected.</p>
    </div>

    <UButton @click="navigateTo('/')" class="!bg-black dark:!bg-white"
      >Go to Home</UButton
    >
  </div>
</template>
