<script setup lang="ts">
import { Drawer } from "@nativescript-community/ui-drawer";
import { EventData, LoadEventData, SegmentedBar } from "@nativescript/core";

import Auth from "~/pages/auth.vue";
import { usePreferences } from "~/utils/usePreferences";

import {
  watch,
  $navigateTo,
  inject,
  ref,
  onMounted,
  Ref,
  computed,
} from "nativescript-vue";
import { IAuthService } from "~/core/contracts";

const props = defineProps<{
  drawerOpen: boolean;
}>();

watch(
  () => props.drawerOpen,
  (newVal) => {
    if (newVal) {
      drawer.value?.nativeView.open("right");
    } else {
      drawer.value?.nativeView.close();
    }
  }
);

onMounted(() => {
  if (props.drawerOpen) {
    drawer.value?.nativeView.open("right");
  }
});

const authService = inject<IAuthService>("authService") as IAuthService;
const preferences = usePreferences();

const isLight = inject<Ref<boolean>>("isLight")!;

const drawer = ref<Drawer>();

const handleAppearanceChange = (value: string) => {
  preferences.setAppearance(value);
  isLight.value = value === "Light";
};

const handleSignOut = async () => {
  try {
    await authService.signOut();
    preferences.clearUser();
    authService.user.value = null;

    drawer.value?.nativeView.close();

    $navigateTo(Auth, { clearHistory: true });
    // Optionally, navigate back to the auth page or perform other actions
  } catch (error) {
    console.error("Error during sign out:", error);
  }
};

const emits = defineEmits<{
  (e: "update:drawerClose"): void;
}>();

const handleSelectedIndexChange = (args: EventData) => {
  const segmentedBar = args.object as SegmentedBar;
  handleAppearanceChange(segmentedBar.selectedIndex ? "Dark" : "Light");
};
</script>
<template>
  <Page :class="isLight ? 'ns-light' : 'ns-dark'">
    <ActionBar
      class="bg-sky-700 dark:bg-black"
      :backgroundColor="isLight ? '#fff' : '#101622'"
    >
      <slot name="actionBarContent" />
    </ActionBar>

    <Drawer
      ref="drawer"
      :backgroundColor="isLight ? '#fff' : '#101622'"
      @close="emits('update:drawerClose')"
      :gestureHandlerOptions="{
        failOffsetYStart: -10,
        failOffsetYEnd: 10,
      }"
    >
      <GridLayout
        ~rightDrawer
        class="w-4/5 bg-white dark:bg-[#262626] h-full rounded-left-side"
        :backgroundColor="isLight ? '#fff' : '#101622'"
        width="300"
        rows="auto * auto"
      >
        <StackLayout row="2">
          <GridLayout
            margin="20"
            columns="auto"
            rows="auto auto"
            class="p-4 dark:bg-[#262626] border-b border-gray-400 dark:border-gray-400"
          >
            <Label
              text="Appearance"
              textWrap="true"
              class="text-[#121212] dark:text-white"
              color="rgb(144, 161, 185)"
              textTransform="uppercase"
              fontWeight="500"
              fontSize="12"
            />
            <GridLayout
              height="40"
              marginTop="10"
              padding="3"
              row="1"
              columns="*"
              orientation="horizontal"
              width="100%"
              class=""
              :backgroundColor="isLight ? 'rgb(0, 89, 138)' : 'rgb(0, 89, 138)'"
            >
              <SegmentedBar
                :selectedIndex="isLight ? 0 : 1"
                color="#fff"
                @selectedIndexChanged="handleSelectedIndexChange"
                selectedBackgroundColor="rgb(0, 166, 244)"
                :backgroundColor="
                  isLight ? 'rgb(0, 89, 138)' : 'rgb(0, 89, 138)'
                "
                selectedTextColor="#fff"
                borderRadius="32"
              >
                <SegmentedBarItem
                  title="&#xf185;"
                  color="#fff"
                  borderRadius="12"
                  class="fas"
                />
                <SegmentedBarItem title="&#xf186;" color="#fff" class="fas" />
              </SegmentedBar>
            </GridLayout>
          </GridLayout>

          <StackLayout
            rows=""
            columns=""
            class="p-4 border-b border-gray-400 dark:bg-[#262626]"
            borderTopWidth="1"
            borderTopColor="rgba(0, 0, 0, 0.1)"
            paddingLeft="10"
            paddingRight="20"
          >
            <Button
              col="1"
              backgroundColor="transparent"
              horizontalAlignment="left"
              textTransform="none"
              :color="isLight ? '#262626' : '#F0F4F8'"
              text="&#xf2f5; Sign Out"
              fontWeight="400"
              androidElevation="0"
              class="fas m-2 bg-transparent border-0 text-[#121212] dark:text-white"
              @tap="handleSignOut"
            />
          </StackLayout>
        </StackLayout>
      </GridLayout>

      <slot />
    </Drawer>
  </Page>
</template>
<style lang="css" scoped>
.rounded-left-side {
  border-radius: 16 0 0 16;
}
</style>
