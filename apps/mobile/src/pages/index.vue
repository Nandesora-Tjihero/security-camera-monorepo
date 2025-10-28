<script lang="ts" setup>
  import { inject, onBeforeUnmount, onMounted, ref } from 'nativescript-vue';
  import Auth from './auth.vue';
  import mainLayout from './mainLayout.vue';
  import { IAuth } from '@nativescript/firebase-auth';
  import { IAuthService } from '~/core/contracts';
  import { Application, isAndroid } from '@nativescript/core';

  const authService = inject<IAuthService>('authService');
  const appearance = inject<string>('appearance');
  const backButtonHandler = () => {
    console.log('Back button pressed');
    if (!authService?.user?.value) {
      // Prevent back navigation if user is not authenticated
      return;
    }
  };
</script>
<template>
  <Frame :class="`ns-${appearance?.toLowerCase()}`">
    <Auth />
  </Frame>
</template>
