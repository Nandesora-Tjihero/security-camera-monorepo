<template>
  <div class="h-screen overflow-y-hidden">
    <BaseHeader
      :nav-items="navItems"
      class="fixed h-32 top-0 left-0 right-0 z-50 bg-sky-50 dark:bg-gray-500/5 backdrop-blur-md"
    />
    <div class="h-[calc(100vh-8rem)] mt-32 overflow-y-auto">
      <NuxtPage />
      <BaseFooter class="" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { loadModel } from '#layers/detection/app/utils/tfjs';

  loadModel();

  useHead({
    title: 'Security Camera',
    link: [
      {
        rel: 'manifest',
        href: '/app.webmanifest',
      },
    ],
    script: [
      {
        src: 'https://js.stripe.com/v3/buy-button.js',
        async: true,
      },
      {
        src: 'https://js.stripe.com/v3/pricing-table.js',
        async: true,
      },
    ],
  });

  const navItems = ref<{ label: string; to: string }[]>([]);
  const route = useRoute();

  onMounted(async () => {
    console.log('Mounted index.vue, user:', useUser().user.value);

    if (route.path === '/') {
      navItems.value = [
        { label: 'About', to: '/#about' },
        { label: 'Features', to: '/#features' },
        { label: 'Pricing', to: '/#pricing' },
        { label: 'Testimonials', to: '/#testimonials' },
        { label: 'FAQ', to: '/#faq' },
        { label: 'Blog', to: '/blog' },
      ];
    }
  });
</script>
