<script lang="ts" setup>
  import {
    onMounted,
    inject,
    $navigateTo,
    Ref,
    ref,
    computed,
  } from 'nativescript-vue';
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

  const appearance = inject<Ref<string>>('appearance');
  const isLight = computed(() => appearance?.value === 'Light');
</script>
<template>
  <Page
    class=""
    @loaded="onPageLoaded"
    actionBarHidden="true"
  >
    <GridLayout
      class="py-40"
      rows="300 * 56 120"
    >
      <Image
        paddingTop="300"
        src="~/assets/images/owl-mobile-removebg.png"
        stretch="aspectFill"
      />

      <StackLayout
        row="0"
        :class="isLight ? 'grad-to-bottom' : 'grad-to-bottom-dark'"
      />

      <StackLayout
        row="0"
        :class="isLight ? 'grad-to-top' : 'grad-to-top-dark'"
      />

      <Label
        row="0"
        marginTop="300"
        width="80"
        height="80"
        :class="isLight ? 'blue-glow-bg' : 'blue-glow-bg-dark'"
        horizontalAlignment="center"
        verticalAlignment="center"
      />

      <GridLayout
        row="0"
        marginTop="270"
        :backgroundColor="isLight ? '#fff' : '#101622'"
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
            :color="isLight ? '#0f172b' : '#fff'"
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
        :color="isLight ? '#62748e' : '#90A1B9'"
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
        borderColor="#e2e8f0"
        borderWidth="2"
        androidElevation="1"
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
  .grad-to-bottom {
    background-image: linear-gradient(
      to bottom,
      transparent,
      transparent,
      white
    );
  }

  .grad-to-top {
    background-image: linear-gradient(
      to top,
      white,
      rgba(255, 255, 255, 0.8),
      transparent
    );
  }

  .grad-to-bottom-dark {
    background-image: linear-gradient(to bottom, #101622, transparent, #101622);
  }
  .grad-to-top-dark {
    background-image: linear-gradient(to top, #101622, #101622cc, transparent);
  }

  .blue-glow-bg-dark {
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

  .blue-glow-bg {
    /* 1. Adjusted Shadow:
          We keep the blue hue but often lower the opacity slightly 
          in light mode for a cleaner look. 
    */
    box-shadow: 0 0 30px 5px rgba(43, 108, 238, 0.25);

    /* 2. Fixed Unit: 
          Added 'px' to the margin (CSS requires units for non-zero numbers).
    */
    margin: 80px;

    /* 3. Background Color:
          Swapped dark hex #101622 for White #FFFFFF.
    */
    background-color: #ffffff;

    /* 4. Gradients:
          Updated to fade from White (#ffffff) to Transparent.
          Note: I combined the gradients into one property so both sides fade.
    */
    background-image: linear-gradient(to right, #ffffff, #ffffffcc, transparent),
      linear-gradient(to left, #ffffff, #ffffffcc, transparent);

    /* Ensure the background stays inside the circle */
    border-radius: 100%;
  }
</style>
