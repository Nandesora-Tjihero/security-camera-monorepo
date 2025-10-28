<script lang="ts" setup>
  import { onMounted, inject, $navigateTo } from 'nativescript-vue';
  import { INotificationService } from '~/core/contracts';

  import { IAuthService } from '~/core/contracts/auth.contract';
  import { IDatabaseService } from '~/core/services/database.service';
  import Dashboard from './dashboard.vue';
  import {
    ApplicationSettings,
    Button,
    Frame,
    GridLayout,
    Image,
    LoadEventData,
    TouchGestureEventData,
  } from '@nativescript/core';
  import MainLayout from './mainLayout.vue';

  const authService = inject<IAuthService>('authService') as IAuthService;
  const databaseService = inject<IDatabaseService>(
    'databaseService'
  ) as IDatabaseService;
  const notificationService = inject<INotificationService>(
    'notificationService'
  ) as INotificationService;

  onMounted(() => {
    if (authService?.user?.value) {
      $navigateTo(MainLayout, { clearHistory: true });
    }
  });

  const handleSignInWithGoogle = async (e: TouchGestureEventData) => {
    const parent = (e.object as Button).parent as GridLayout;
    // animate grid layout to scale down to 0.95 and back to 1
    await parent.animate({
      scale: { x: 0.95, y: 0.95 },
      duration: 100,
    });
    await parent.animate({
      scale: { x: 1, y: 1 },
      duration: 100,
    });

    try {
      const user = await authService.signInWithGoogle();
      if (!user) {
        throw new Error('No user returned from Google Sign-In');
      }
      const userInDB = await databaseService.getUserById(user.uid);
      if (!userInDB) {
        throw new Error(
          'Account with this email does not exist. Go to the web app to create an account and try again here.'
        );
      }
      if (user) {
        // Navigate to the main page or perform other actions
        const hasPermission = await notificationService.requestUserPermission();
        await notificationService.registerDeviceForPushNotifications(user.uid);
        $navigateTo(MainLayout, { clearHistory: true });
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  const onPageLoaded = () => {
    authService.user.value = ApplicationSettings.getString(
      'userId'
    ) as unknown as any;
    if (authService?.user?.value) {
      $navigateTo(MainLayout, { clearHistory: true });
    }
  };
</script>
<template>
  <Page
    class=""
    @loaded="onPageLoaded"
  >
    <ActionBar class="">
      <Label
        text="Sign In"
        class="font-bold text-lg"
      />
    </ActionBar>

    <GridLayout
      class="py-10"
      rows="* auto"
      columns="*"
    >
      <Label
        text=""
        textWrap="true"
      />

      <GridLayout
        row="1"
        class="mb-30 rounded-4xl bg-black text-white dark:bg-white dark:text-black h-16 mx-5"
      >
        <Image
          horizontalAlignment="left"
          src="~/assets/images/google-logo-48.png"
          class="h-10 ml-4"
        />
        <Button
          stretch=""
          androidElevation="0"
          class="border-0 bg-transparent text-white dark:text-black font-bold"
          text="Sign In with Google"
          @tap="handleSignInWithGoogle"
          @loaded="(event: LoadEventData) => {
            const btn = event.object as Button;
            btn.androidDynamicElevationOffset = 0;

          }"
        />
      </GridLayout>
    </GridLayout>
  </Page>
</template>
