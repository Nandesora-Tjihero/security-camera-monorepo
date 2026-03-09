<template>
  <div class="flex flex-col justify-between h-full">
    <div>
      <div class="mb-2">
        <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          Account Settings
        </span>
      </div>
      <UNavigationMenu
        :items="options"
        orientation="vertical"
        class="-mx-2.5"
      />
    </div>
    <div />
  </div>
</template>

<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';
  import { getAuthService } from '~~/layers/01-base/app/utils/services';

  const { clearUser, setSubscription } = useUser();
  const emits = defineEmits(['close']);

  const signOut = async () => {
    try {
      await getAuthService().signOut();
      emits('close');
      clearUser();
      setSubscription(null);
      await fetch('/api/session-logout', { method: 'POST' });
      await navigateTo('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

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
</script>
