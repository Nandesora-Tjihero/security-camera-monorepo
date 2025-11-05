<template>
  <NuxtErrorBoundary>
    <UContainer class="flex flex-col p-10 items-center h-full">
      <BaseHeading class="mb-10">Sign In</BaseHeading>

      <h2 class="text-xl mb-5">To start monitoring, sign in.</h2>

      <UButton
        @click="signInWithGoogle"
        class="!bg-black dark:!bg-white"
        data-testid="google-signin-btn"
        >Sign In With Google</UButton
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
  import {
    getAuthService,
    getDatabaseService,
    getBillingService,
  } from '~~/layers/01-base/app/utils/services';

  const { subscription, user, setUser, setSubscription } = useUser();

  const { markFreeTrialSeen } = useSubscription();

  const authService = getAuthService();

  const databaseService = getDatabaseService();

  const billingService = getBillingService();

  const resetError = (error: any) => {
    error.value = null;
  };

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
        const userFromGoogleAuth = await authService.signInWithGoogle();
        let userFromDB = await databaseService.getUserById(
          (userFromGoogleAuth as GoogleUser).uid
        );
        console.log('Fetched user from DB:', userFromDB);

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
        console.log('User signed in:', userFromDB);
        setUser(userFromDB!); // this triggers the watch above to get subscription from db
      } else {
        console.error('Auth service is not available.');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };
</script>
