<template>
  <NuxtErrorBoundary>
    <UContainer
      class="wrapper flex flex-col items-center justify-center h-[calc(100vh-var(--ui-header-height))]"
    >
      <BaseHeading
        class="mb-10"
        data-testid="auth-page"
        >Sign In</BaseHeading
      >

      <h2 class="text-xl mb-5">To start monitoring, sign in.</h2>

      <UButton
        @click="signInWithGoogle"
        class="bg-black! dark:bg-white!"
        data-testid="google-signin-btn"
        >Sign In with Google</UButton
      >
    </UContainer>

    <template #error="{ error }">
      <p class="text-red-500">
        Error: <code>{{ error }}</code>
      </p>

      <UButton @click="resetError(error)"> Reset </UButton>
    </template>
  </NuxtErrorBoundary>
</template>
<script setup lang="ts">
  import type { GoogleUser } from '#shared/core/models';
  import type { User } from 'firebase/auth';
  import {
    getAuthService,
    getDatabaseService,
    getBillingService,
  } from '#layers/01-base/app/utils/services';

  const { subscription, user, setUser, setSubscription } = useUser();

  const { markFreeTrialSeen } = useSubscription();

  const authService = getAuthService();

  const databaseService = getDatabaseService();

  const billingService = getBillingService();

  const toast = useToast();

  import { loadModel, loadingModel } from '~~/layers/detection/app/utils/tfjs';

  const resetError = (error: any) => {
    error.value = null;
  };

  onMounted(async () => {
    // Prefetch the model when the user visits the auth page.
    // This ensures we don't slow down the landing page, but have it ready
    // for the user when they eventually access the camera.
    // If it fails here, we can catch it, or let the actual detection service handle it later.
    try {
      console.log('Prefetching AI Model...');
      await loadModel();
      console.log('AI Model Prefetched successfully');
    } catch (e) {
      console.warn('AI Model prefetch failed - will retry on camera start', e);
    }
  });
  watch(
    () => user.value,
    async (newUser) => {
      if (newUser) {
        const sub = await databaseService.getSubscription(newUser.uid);
        //   update the subscription state in useUser
        setSubscription(sub);

        // if no subscription from db, create a free trial subscription
        const userEmail = user.value?.email;
        if (!subscription.value && userEmail) {
          // create a checkout session for free trial
          try {
            await billingService.createCheckoutSession(
              'Security_Camera-fd2ded4',
              userEmail,
              'free-trial'
            );
          } catch (error) {
            console.error('Error creating checkout session:', error);
          }
        }
      }
    }
  );

  watch(
    () => subscription.value,
    async (newSubscription) => {
      if (newSubscription && user.value) {
        // Mark that the user has used their free trial
        // marking this here ensures it is only marked after subscription status
        // is obtained from db, the Source of Truth for subscription status
        markFreeTrialSeen();
        await navigateTo('/dashboard');
      }
    }
  );

  const signInWithGoogle = async () => {
    try {
      if (authService) {
        const userFromGoogleAuth: User = await authService.signInWithGoogle();
        let userFromDB = await databaseService.getUserById(
          (userFromGoogleAuth as GoogleUser).uid
        );

        // new user, create in database and create a free trial subscription
        if (!userFromDB) {
          // New user, save to database
          await databaseService.createUser(
            authService.convertToScUser(userFromGoogleAuth)
          );

          userFromDB = await databaseService.getUserById(
            (userFromGoogleAuth as GoogleUser).uid
          );
        }
        await $fetch('/api/session-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: await userFromGoogleAuth.getIdToken(),
          }),
          onRequestError: (error) => {
            console.error('Error during session login:', error);
            throw error;
          },
        });
        setUser(userFromDB!); // this triggers the watch above to get subscription from db
      } else {
        console.error('Auth service is not available.');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast.add({
        color: 'error',
        title: 'Authentication Error',
        description:
          'There was an error during sign-in. Please try again. ' +
          (error as Error).message,
      });
    }
  };
</script>
<style scoped>
  .wrapper {
    margin-top: var(--ui-header-height);
  }
</style>
