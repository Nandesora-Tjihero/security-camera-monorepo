<script setup lang="ts">
  import { inject, ref } from 'nativescript-vue';
  import SCDrawer from '~/components/SCDrawer.vue';
  const drawerOpen = ref(false);
</script>
<template>
  <Page class="">
    <ActionBar class="bg-white dark:bg-black">
      <GridLayout columns="">
        <Button
          @tap="drawerOpen = drawerOpen ? false : true"
          text="Open Drawer"
          width="250"
          marginTop="25"
        />
      </GridLayout>
    </ActionBar>

    <SCDrawer
      ref="drawer"
      :drawerOpen="drawerOpen"
    >
      <template #default>
        <StackLayout
          ~mainContent
          class="p-4"
        >
          <Label
            text="Welcome to the Dashboard!"
            class="font-bold text-lg m-4"
          />
        </StackLayout>
      </template>
    </SCDrawer>
  </Page>
</template>
<script lang="ts" setup></script>
