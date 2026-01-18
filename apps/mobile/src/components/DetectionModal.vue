<script setup lang="ts">
import { $closeModal, computed, inject, Ref } from "nativescript-vue";
import { IDetection } from "~/core/models";

const props = defineProps<{
  detection: IDetection;
}>();

const closeModal = () => {
  $closeModal();
};

const isLight = inject<Ref<boolean>>("isLight");
</script>
<template>
  <Frame>
    <Page actionBarHidden="true">
      <StackLayout class="bg-[#262626]">
        <GridLayout>
          <Image
            :src="detection.imageUrl"
            verticalAlignment="center"
            stretch="aspectFill"
            height="300"
            backgroundColor="rgba(0,0,0,.6)"
          />
          <Button
            :backgroundColor="
              isLight ? 'rgb(243, 244, 246)' : 'rgba(255, 255, 255, 0.05)'
            "
            borderRadius="100"
            width="50"
            height="50"
            padding="10"
            marginTop="25"
            marginRight="10"
            fontSize="24"
            horizontalAlignment="right"
            verticalAlignment="top"
            :color="isLight ? 'rgb(75, 85, 99)' : 'rgb(203, 213, 225)'"
            text="&#xf00d;"
            androidElevation="0"
            class="fas text-xl text-dark dark:text-white bg-transparent border-0"
            @tap="closeModal"
          />
        </GridLayout>
        <Label />
      </StackLayout>
    </Page>
  </Frame>
</template>
