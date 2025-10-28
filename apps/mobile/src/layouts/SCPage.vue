<script setup lang="ts">
  import { Drawer } from '@nativescript-community/ui-drawer';
  import { ApplicationSettings } from '@nativescript/core';

  import Auth from '~/pages/auth.vue';

  import {
    watch,
    $navigateTo,
    inject,
    ref,
    onMounted,
    Ref,
  } from 'nativescript-vue';
  import { IAuthService } from '~/core/contracts';

  const props = defineProps<{
    drawerOpen: boolean;
  }>();

  watch(
    () => props.drawerOpen,
    (newVal) => {
      console.log('drawerOpen changed:', newVal);
      if (newVal) {
        console.log('opening drawer', drawer.value?.nativeView);
        drawer.value?.nativeView.open('right');
      } else {
        console.log('closing drawer');
        drawer.value?.nativeView.close();
      }
    }
  );

  onMounted(() => {
    console.log('SCDrawer mounted, initial drawerOpen:', props.drawerOpen);
    if (props.drawerOpen) {
      drawer.value?.nativeView.open('right');
    }
  });

  const authService = inject<IAuthService>('authService') as IAuthService;

  const appearanceOptions = [
    { value: 'Light', label: 'Light', icon: '&#xf185;' },
    { value: 'Dark', label: 'Dark', icon: '&#xf186;' },
  ];

  const appearance = inject<Ref<string>>('appearance');

  const drawer = ref<Drawer>();

  const handleAppearanceChange = (value: string) => {
    ApplicationSettings.setString('appearance', value);
    if (appearance) {
      appearance.value = ApplicationSettings.getString('appearance', 'Light');
    }
    console.log('Appearance changed to:', appearance?.value);
    // Here you can add logic to actually change the app's appearance
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      ApplicationSettings.remove('userId');
      authService.user.value = null;
      console.log('User signed out successfully o');
      drawer.value?.nativeView.close();

      $navigateTo(Auth, { clearHistory: true });
      // Optionally, navigate back to the auth page or perform other actions
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  const emits = defineEmits<{
    (e: 'update:drawerClose'): void;
  }>();
</script>
<template>
  <Page :class="appearance && appearance === 'Dark' ? 'ns-dark' : 'ns-light'">
    <ActionBar class="bg-sky-700 dark:bg-black">
      <slot name="actionBarContent" />
    </ActionBar>

    <Drawer
      ref="drawer"
      @close="emits('update:drawerClose')"
      :gestureHandlerOptions="{
        failOffsetYStart: -10,
        failOffsetYEnd: 10,
      }"
    >
      <StackLayout
        ~rightDrawer
        class="w-4/5 bg-white dark:bg-[#262626] h-full"
      >
        <GridLayout
          columns="auto *"
          rows="auto"
          class="p-4 dark:bg-[#262626] border-b border-gray-400 dark:border-gray-400"
        >
          <Label
            text="Appearance"
            textWrap="true"
            class="text-[#121212] dark:text-white"
          />
          <StackLayout
            col="1"
            orientation="horizontal"
            class=""
          >
            <Button
              text="&#xf185;"
              androidElevation="0"
              class="fas m-2 bg-transparent text-[#121212] dark:text-white"
              :class="
                appearance === 'Light'
                  ? 'border-b-4 border-sky-500'
                  : 'border-0'
              "
              @tap="handleAppearanceChange('Light')"
            />

            <Button
              text="&#xf186;"
              androidElevation="0"
              class="fas m-2 bg-transparent border-0 text-[#121212] dark:text-white"
              :class="
                appearance === 'Dark'
                  ? 'border-b-4 dark:border-sky-500'
                  : ' border-0'
              "
              @tap="handleAppearanceChange('Dark')"
            />
          </StackLayout>
        </GridLayout>

        <StackLayout
          rows=""
          columns=""
          class="p-4 border-b border-gray-400 dark:bg-[#262626]"
        >
          <Button
            col="1"
            text="Sign Out &#xf2f5;"
            androidElevation="0"
            class="fas m-2 bg-transparent border-0 text-[#121212] dark:text-white"
            @tap="handleSignOut"
          />
        </StackLayout>
      </StackLayout>

      <slot />
    </Drawer>
  </Page>
</template>
