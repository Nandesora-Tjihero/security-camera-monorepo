<template>
  <UApp
    :toaster="{ position: 'top-center' }"
    class=""
  >
    <UHeader
      title="Security Camera"
      to="/"
      class="border-b-0 shadow-md fixed inset-0 w-full"
      mode="slideover"
      :ui="{
        body: 'h-full',
        content:
          'bg-transparent before:absolute before:inset-0 before:w-3/4 before:h-full before:bg-default before:rounded-r-lg before:-z-10',
      }"
    >
      <template #right>
        <BaseHeaderRight :nav-items="navItems" />
      </template>

      <template #body>
        <div class="flex flex-col justify-between h-full">
          <div>
            <div class="mb-2">
              <span
                class="text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                >Account Settings</span
              >
            </div>
            <UNavigationMenu
              :items="user ? options : []"
              orientation="vertical"
              class="-mx-2.5"
            />
          </div>
          <div></div>
        </div>
      </template>
    </UHeader>

    <UMain class="overflow-y-auto">
      <NuxtPage />
    </UMain>

    <USeparator
      icon="i-simple-icons-nuxtdotjs"
      type="dashed"
    />

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>

      <UNavigationMenu
        :items="items"
        variant="link"
      />

      <template #right>
        <UButton
          icon="i-simple-icons-discord"
          color="neutral"
          variant="ghost"
          to="https://go.nuxt.com/discord"
          target="_blank"
          aria-label="Discord"
        />
        <UButton
          icon="i-simple-icons-x"
          color="neutral"
          variant="ghost"
          to="https://go.nuxt.com/x"
          target="_blank"
          aria-label="X"
        />
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/nuxt"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </UApp>
</template>
<script setup lang="ts">
  // import { loadModel } from '~~/layers/detection/app/utils/tfjs';
  // loadModel(); removed for lazy loading

  import { getAuthService } from '~~/layers/01-base/app/utils/services';

  const { clearUser, setSubscription, user } = useUser();
  const emits = defineEmits(['close']);

  const signOut = async () => {
    try {
      await getAuthService().signOut();
      emits('close');
      clearUser();
      setSubscription(null);
      await fetch('/api/session-logout', { method: 'POST' });
      // useState("user", () => null); why does it cause weird behavior on signin again?
      await navigateTo('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  import type { NavigationMenuItem } from '@nuxt/ui';

  const options = computed<NavigationMenuItem[]>(() => [
    {
      icon: 'i-heroicons-credit-card',
      label: 'Billing',
      click: () => navigateTo('/subscriptions'),
    },
    {
      icon: 'i-heroicons-arrow-right-start-on-rectangle',
      label: 'Sign Out',
      onSelect: signOut,
    },
  ]);

  const items: NavigationMenuItem[] = [
    {
      label: 'Figma Kit',
      to: 'https://go.nuxt.com/figma-ui',
      target: '_blank',
    },
    {
      label: 'Playground',
      to: 'https://stackblitz.com/edit/nuxt-ui',
      target: '_blank',
    },
    {
      label: 'Releases',
      to: 'https://github.com/nuxt/ui/releases',
      target: '_blank',
    },
  ];

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
