<template>
  <LandingHero class="w-full h-[calc(100vh-var(--ui-header-height))]" />
  <LandingFeatures
    class="border-b border-white/15 bg-sky-50 dark:bg-[#121212] h-screen"
  />
  <!--<LandingQuickStart class="border-b border-white/15" />
    <LandingAffordable class="border-b border-white/15" /> -->
  <!-- <LandingFAQ /> -->
</template>

<script setup lang="ts">
  const { user } = useUser();

  if (user.value) {
    await navigateTo('/dashboard');
  }
</script>
