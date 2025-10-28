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
    <Page>
      <ActionBar title="Detection Details">
        <GridLayout
          rows=""
          columns=""
        >
          <Button
            horizontalAlignment="right"
            text="&#xf00d;"
            androidElevation="0"
            class="fas text-xl text-dark dark:text-white bg-transparent border-0"
            @tap="closeModal"
          />
        </GridLayout>
      </ActionBar>
      <StackLayout class="bg-[#262626] p-4">
        <Image
          :src="detection.imageUrl"
          stretch="aspectFill"
          height="300"
        />
      </StackLayout>
    </Page>
  </Frame>
</template>
