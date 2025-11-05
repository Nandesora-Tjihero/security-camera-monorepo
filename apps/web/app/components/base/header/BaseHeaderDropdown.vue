<template>
  <div>
    <UDropdown
      ref="dropdown"
      id="userDropdown"
      v-if="user"
      :items="options"
      class="border-none"
      mode="click"
      :popper="{ placement: 'bottom-start', arrow: false }"
    >
      <UButton
        class="!bg-primary-500 text-white"
        color="white"
        :label="user.displayName as string || user.email as string"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />
    </UDropdown>
    <ULink
      v-if="canSignIn"
      @click.prevent="goToLogin"
      >Login</ULink
    >
  </div>
</template>

<script setup lang="ts">
  import { getAuthService } from '~~/layers/01-base/app/utils/services';

  const { setUser, setSubscription } = useUser();
  const emits = defineEmits(['close']);

  const signOut = async () => {
    try {
      await getAuthService().signOut();
      emits('close');
      setUser(null);
      setSubscription(null);
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
        click: () => navigateTo('/subscriptions'),
      },
      {
        label: 'Sign Out',
        click: signOut,
      },
    ],
  ];

  // user can sign in if they are not logged in, the model is loaded, and camera is supported
  const { user } = useUser();
  const { canSignIn } = useUserCanSignIn();

  const goToLogin = async () => {
    emits('close');
    await navigateTo('/auth');
  };
</script>
