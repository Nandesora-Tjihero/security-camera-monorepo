<script lang="ts" setup>
  import { onMounted, inject, $navigateTo, Ref, ref } from 'nativescript-vue';
  import { INotificationService } from '~/core/contracts';

  import { IAuthService } from '~/core/contracts/auth.contract';
  import { IDatabaseService } from '~/core/services/database.service';

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
  import { IDetection } from '~/core/models';

  const authService = inject<IAuthService>('authService') as IAuthService;
  const databaseService = inject<IDatabaseService>(
    'databaseService'
  ) as IDatabaseService;
  const notificationService = inject<INotificationService>(
    'notificationService'
  ) as INotificationService;

  const detections =
    inject<Ref<IDetection[]>>('detections') || ref<IDetection[]>([]);

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

      console.log('user in db', userInDB.detections);
      if (userInDB.detections && userInDB.detections.length) {
        detections.value = userInDB.detections;
      }
      // Navigate to the main page or perform other actions
      const hasPermission = await notificationService.requestUserPermission();
      await notificationService.registerDeviceForPushNotifications(user.uid);
      $navigateTo(MainLayout, { clearHistory: true });
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
        text=""
        class="font-bold text-lg"
      />
    </ActionBar>

    <GridLayout
      class="py-10"
      rows="300 * 56 120"
    >
      <Image src="~/assets/images/owl-mobile-removebg.png" />

      <StackLayout
        row="0"
        class="grad-to-bottom"
      />

      <StackLayout
        row="0"
        class="grad-to-top"
      />

      <Label
        row="0"
        marginTop="300"
        width="80"
        height="80"
        class="blue-glow-bg"
        horizontalAlignment="center"
        verticalAlignment="center"
      />

      <GridLayout
        row="0"
        marginTop="270"
        backgroundColor="#101622"
        horizontalAlignment="center"
        verticalAlignment="center"
        borderColor="#FFFFFF1A"
        borderWidth="1"
        borderRadius="50"
        height="80"
        width="80"
      >
        <Label
          horizontalAlignment="center"
          verticalAlignment="center"
          fontSize="32"
          color="#2b6cee"
          class="fas text-center"
          text="&#xf0f3;"
        />
      </GridLayout>

      <Label
        textWrap="true"
        paddingLeft="30"
        paddingRight="30"
        fontWeight="700"
        row="1"
        fontSize="36"
        textAlignment="center"
        verticalAlignment="top"
        marginTop="50"
        lineHeight="-0.5"
      >
        <FormattedString>
          <Span
            text="Alertas de intrusos "
            color="#fff"
          />
          <Span
            text="al instante."
            color="#2b6cee"
          />
        </FormattedString>
      </Label>

      <Label
        row="1"
        verticalAlignment="top"
        marginTop="150"
        text="Recibe notificaciones inmediatas de detección desde tu cámara de seguridad web directamente en este dispositivo."
        textWrap="true"
        fontSize="18"
        paddingLeft="30"
        paddingRight="30"
        textAlignment="center"
        color="#90A1B9"
      />

      <FlexboxLayout
        backgroundColor="#fff"
        justifyContent="center"
        verticalAlignment="top"
        row="2"
        marginLeft="30"
        marginRight="30"
        class="mb-30 rounded-2xl bg-black text-white dark:bg-black dark:text-black h-16 mx-10"
        borderRadius="10"
      >
        <Image
          horizontalAlignment="left"
          src="~/assets/images/google-logo-48.png"
          class="ml-4"
          height="30"
        />
        <Button
          backgroundColor="transparent"
          col="1"
          androidElevation="0"
          class="border-0 bg-transparent text-white dark:text-black font-bold ml-10"
          text="Iniciar con Google"
          textTransform="none"
          @tap="handleSignInWithGoogle"
          @loaded="(event: LoadEventData) => {
            const btn = event.object as Button;
            btn.androidDynamicElevationOffset = 0;

          }"
        />
      </FlexboxLayout>
    </GridLayout>
  </Page>
</template>
<style scoped>
  /* Gradient 1: Top to Bottom 
     from-transparent via-transparent to-background-dark (#101622)
  */
  .grad-to-bottom {
    background-image: linear-gradient(to bottom, #101622, transparent, #101622);
  }

  /* Gradient 2: Bottom to Top 
     from-background-dark (#101622) via-background-dark/80 to-transparent
     
     #101622CC is the 8-digit hex code for your color at 80% opacity.
  */
  .grad-to-top {
    background-image: linear-gradient(to top, #101622, #101622cc, transparent);
  }

  .blue-glow-bg {
    box-shadow: 0 0 30px 5px rgba(43, 108, 238, 0.3);

    /* IMPORTANT: 
       1. Shadows are drawn *outside* the element. You must add margin 
          so the parent container doesn't clip the glow.
    */
    margin: 30;

    /* 2. An element must have a background-color to cast a shadow.
          If your element is transparent, the shadow might not appear.
    */
    background-color: #101622;
    background-image: linear-gradient(
      to right,
      #101622,
      #101622cc,
      transparent
    );

    background-image: linear-gradient(to left, #101622, #101622cc, transparent);
    border-radius: 100%;
  }
</style>
