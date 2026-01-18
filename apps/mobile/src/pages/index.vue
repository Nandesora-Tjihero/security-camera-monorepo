<script lang="ts" setup>
import { inject, Ref } from "nativescript-vue";
import Auth from "./auth.vue";
import { IAuthService } from "~/core/contracts";

const authService = inject<IAuthService>("authService");
const isLight = inject<Ref<boolean>>("isLight")!;

const backButtonHandler = () => {
  if (!authService?.user?.value) {
    // Prevent back navigation if user is not authenticated
    return;
  }
};
</script>
<template>
  <Frame :class="isLight ? 'ns-light' : 'ns-dark'">
    <Auth />
  </Frame>
</template>
