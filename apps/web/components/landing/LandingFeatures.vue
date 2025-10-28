<template>
  <section class="border-b">
    <UContainer
      class="grid md:grid-rows-[auto_1fr] md:gap-x-3 gap-y-10 md:grid-cols-3 py-20"
    >
      <h2 class="md:col-span-3 text-3xl font-bold">Why use Security Camera</h2>
      <UCard
        v-for="(feature, index) in features"
        :key="feature.title"
        class="ring-primary dark:ring-primary dark:bg-gray-800/25"
        :class="`col-span-${index}`"
      >
        <template #header>
          <h3 class="text-xl font-medium mb-2">{{ feature.title }}</h3>
        </template>
        <div>
          <img />
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            {{ feature.body }}
          </p>
        </div>
      </UCard>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
  const features = [
    {
      icon: 'i-heroicons-device-phone-mobile',
      title: 'Your Spare as Smart Security Camera',
      body: 'Turn any spare smartphone into a smart security camera with AI person detection, real-time alerts, and remote access to recordings anytime, anywhere.',
    },
    {
      icon: 'i-heroicons-brain-circuit',
      title: 'Start Monitoring in Minutes',
      body: 'Simple setup and instant protection — start your 14-day free trial with one-click Google sign-in, no credit card needed, and get instant motion alerts on your device.',
    },
    {
      icon: 'i-heroicons-light-bell',
      title: 'Affordable Security for Everyone',
      body: 'Professional-grade security for only €11.99/month — no costly hardware or installation. Enjoy smarter, more affordable home protection after your free trial.',
    },
  ];
  // ...existing code...
</script>
