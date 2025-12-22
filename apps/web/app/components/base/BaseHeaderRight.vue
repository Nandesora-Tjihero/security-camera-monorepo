<template>
  <div class="flex items-center gap-4">
    <UButton
      :icon="
        isDarkMode ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'
      "
      variant="ghost"
      @click="toggleDarkMode"
    />

    <BaseHeaderDropdown class="hidden md:block" />
  </div>
</template>
<script setup lang="ts">
  import type { User } from 'firebase/auth';
  import { getAuthService } from '~~/layers/01-base/app/utils/services';

  const props = defineProps<{
    navItems: { label: string; to: string }[];
  }>();
  const isDarkMode = ref(false);
  const isOpen = ref(false);
  const updateIsOpen = (value: boolean) => {
    isOpen.value = value;
  };
  const user = computed(() => useState('user').value as User);
  const showLoginButton = computed(
    () => !user.value && useRoute().path !== '/auth'
  );
  const signOut = async () => {
    const nuxtApp = useNuxtApp();
    try {
      await getAuthService().signOut();

      clearNuxtState('user');
      // useState("user", () => null); why does it cause weird behavior on signin again?
      await navigateTo('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const options = [
    [
      {
        label: 'Billing',
        click: () => navigateTo('/billing'),
      },
      {
        label: 'Sign Out',
        click: signOut,
      },
    ],
  ];
  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('darkMode', isDark ? 'dark' : 'light');
    isDarkMode.value = localStorage.getItem('darkMode') === 'dark';
  };
</script>
