<script setup lang="ts">
  import { $closeModal } from 'nativescript-vue';
  import { IDetection } from '~/core/models';

  const props = defineProps<{
    detection: IDetection;
  }>();

  const closeModal = () => {
    $closeModal();
  };
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
            horizontalAlignment="right"
            width="50"
            verticalAlignment="top"
            text="&#xf00d;"
            androidElevation="0"
            class="fas text-xl text-dark dark:text-white bg-transparent border-0"
            backgroundColor="transparent"
            color="#fff"
            @tap="closeModal"
          />
        </GridLayout>
        <Label />
      </StackLayout>
    </Page>
  </Frame>
</template>
