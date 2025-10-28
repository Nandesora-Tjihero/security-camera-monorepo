<script setup lang="ts">
  import { FormattedString, ItemEventData } from '@nativescript/core';
  import { separatorColor } from '@nativescript/core/ui/list-view';
  import {
    $showModal,
    computed,
    inject,
    onMounted,
    Ref,
    ref,
    watch,
  } from 'nativescript-vue';
  import DetectionModal from '~/components/DetectionModal.vue';
  import { IAuthService } from '~/core/contracts';
  import { IDetection } from '~/core/models';
  import SCPage from '~/layouts/SCPage.vue';

  const authService = inject<IAuthService>('authService');
  const drawerOpen = ref(false);

  const appearance = inject<string>('appearance');

  const detections =
    inject<Ref<IDetection[]>>('detections') || ref<IDetection[]>([]);

  const detection = ref<IDetection>();

  const handleItemTap = async (args: ItemEventData) => {
    const index = args.index;
    const view = args.view;

    await view.animate({
      scale: { x: 0.95, y: 0.95 },
      duration: 100,
    });
    await view.animate({
      scale: { x: 1, y: 1 },
      duration: 100,
    });

    detection.value = detections.value[index];
    if (detection.value) {
      $showModal(DetectionModal, {
        props: {
          detection: detection.value,
        },
        animated: true,
      });
    }
  };

  const pageTitle = computed(() => {
    return detections.value.length === 0
      ? 'No Detections yet'
      : `Tap an item to expand image`;
  });
</script>
<template>
  <SCPage
    :class="appearance && appearance === 'Dark' ? 'ns-dark' : 'ns-light'"
    :drawerOpen="drawerOpen"
    @update:drawerClose="drawerOpen = false"
  >
    <template #actionBarContent>
      <GridLayout
        columns="* * auto"
        class=""
      >
        <Label
          text="Detections"
          class="text-lg font-bold"
          col="1"
        />
        <Button
          col="2"
          horizontalAlignment="right"
          @tap="drawerOpen = drawerOpen ? false : true"
          text="&#xf013;"
          marginTop="25"
          androidElevation="0"
          class="fas text-xl border-0 bg-transparent"
          :class="appearance === 'Light' ? 'text-sky-500' : 'text-sky-300'"
        />
      </GridLayout>
    </template>

    <template #default>
      <GridLayout
        rows="auto *"
        ~mainContent
        class="py-4"
      >
        <Label
          :text="pageTitle"
          class="my-10 pl-4"
        >
          <FormattedString>
            <Span
              :text="pageTitle"
              class="text-lg text-neutral-600 dark:text-neutral-300"
            />
          </FormattedString>
        </Label>
        <ListView
          row="1"
          :items="detections"
          @itemTap="handleItemTap"
          class="h-full mx-4"
          :separatorColor="appearance == 'Light' ? '#A5A5A5' : '#747474'"
        >
          <template #default="{ item }: { item: IDetection }">
            <GridLayout
              columns="*, *"
              class="mb-5 p-2 bg-neutral-100 dark:bg-neutral-800"
            >
              <Image
                :src="item.imageUrl"
                row="0"
                col="0"
                class="rounded-lg align-middle"
              />

              <Label
                col="1"
                textWrap="true"
                class="text-sm pl-2 mt-2 align-middle"
              >
                <FormattedString>
                  <Span
                    :text="`${new Date(
                      Number(item.fileName.split('_')[1])
                    ).toLocaleString()}`"
                    class="text-black/87 dark:text-white/87"
                  />
                </FormattedString>
              </Label>
            </GridLayout>
          </template>
        </ListView>
      </GridLayout>
    </template>
  </SCPage>
</template>
