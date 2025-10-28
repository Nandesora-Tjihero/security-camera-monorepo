<script setup lang="ts">
  import { Drawer } from '@nativescript-community/ui-drawer';
  import { ApplicationSettings } from '@nativescript/core';
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

  const appearanceOptions = ['Light', 'Dark'];

  const appearance = inject<Ref<string>>('appearance');

  const drawer = ref<Drawer>();

  const handleAppearanceChange = (value: string) => {
    ApplicationSettings.setString('appearance', value);
    if (appearance) {
      appearance.value = ApplicationSettings.getString('appearance', 'Light');
    }
    console.log('Appearance changed to:', value.replace('Dark', 'Dark Mo'));
    // Here you can add logic to actually change the app's appearance
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      ApplicationSettings.remove('userId');
      authService.user.value = null;
      console.log('User signed out successfully');
      //   $navigateTo(Index);
      // Optionally, navigate back to the auth page or perform other actions
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
</script>
<template>
  <Drawer
    ref="drawer"
    :gestureHandlerOptions="{
      failOffsetYStart: -10,
      failOffsetYEnd: 10,
    }"
  >
    <StackLayout ~rightDrawer>
      <GridLayout
        columns="* *"
        rows="auto"
        class="p-4"
      >
        <Label
          text="Appearance"
          textWrap="true"
          class="text-white"
        />
        <StackLayout
          col="1"
          orientation="horizontal"
        >
          <Button
            v-for="value in appearanceOptions"
            :key="value"
            @tap="handleAppearanceChange(value)"
            :text="value"
            :class="`m-2 p-2 rounded ${
              appearance === value
                ? 'bg-sky-200 dark:bg-dark-primary'
                : 'bg-gray-200 dark:bg-gray-700'
            }`"
          />
        </StackLayout>
      </GridLayout>

      <Button
        col="1"
        text="Sign Out"
        class="m-2"
        @tap="handleSignOut"
      />
    </StackLayout>

    <slot />
  </Drawer>
</template>
