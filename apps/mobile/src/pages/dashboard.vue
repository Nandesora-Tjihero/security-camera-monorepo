<script setup lang="ts">
import { FormattedString, ItemEventData } from "@nativescript/core";
import {
  $showModal,
  computed,
  inject,
  onMounted,
  Ref,
  ref,
  watch,
} from "nativescript-vue";

import DetectionModal from "~/components/DetectionModal.vue";
import { IDetection } from "~/core/models";
import SCPage from "~/layouts/SCPage.vue";
import { resolveCachedImage } from "~/composables/useImageResolver";

const drawerOpen = ref(false);

const isLight = inject<Ref<boolean>>("isLight")!;

const detections =
  inject<Ref<IDetection[]>>("detections") || ref<IDetection[]>([]);

const detectionsWithResolvedImages = ref<IDetection[]>([]);

const resolveImages = async () => {
  const promised = detections.value.map(async (detection) => {
    const imageUrl = await resolveCachedImage(detection.filePath);
    return {
      ...detection,
      imageUrl,
    };
  });
  detectionsWithResolvedImages.value = await Promise.all(promised);
};

watch(detections, resolveImages, { immediate: true });

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

  detection.value = detectionsWithResolvedImages.value[index];
  if (detection.value) {
    // // If image URL is missing, try to resolve it one last time (optional)
    // if (!detection.value.imageUrl) {
    //   detection.value.imageUrl = await resolveCachedImage(
    //     detection.value.filePath
    //   );
    // }

    $showModal(DetectionModal, {
      props: {
        detection: detection.value,
      },
      fullscreen: true,
      animated: true,
    });
  }
};

const pageTitle = computed(() => {
  return detections.value.length === 0 ? "No Detections yet" : ``;
});
</script>
<template>
  <SCPage :drawerOpen="drawerOpen" @update:drawerClose="drawerOpen = false">
    <template #actionBarContent>
      <GridLayout paddingBottom="20" columns="* * auto" rows="auto" class="">
        <Label
          text="Detections"
          class="text-lg font-bold"
          fontWeight="700"
          fontSize="20"
          :color="isLight ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'"
          col="0"
        />
        <Label
          marginTop="40"
          text="Security Camera"
          fontWeight="400"
          class="text-lg font-bold"
          fontSize="14"
          :color="isLight ? 'rgb(107, 114, 128)' : 'rgb(148, 163, 184)'"
          col="0"
        />

        <Button
          col="2"
          :backgroundColor="
            isLight ? 'rgb(243, 244, 246)' : 'rgba(255, 255, 255, 0.05)'
          "
          borderRadius="100"
          width="50"
          height="50"
          padding="10"
          fontSize="24"
          horizontalAlignment="right"
          verticalAlignment="center"
          :color="isLight ? 'rgb(75, 85, 99)' : 'rgb(203, 213, 225)'"
          @tap="drawerOpen = drawerOpen ? false : true"
          text="&#xf013;"
          marginTop="25"
          marginRight="10"
          androidElevation="0"
          class="fas text-xl border-0 bg-transparent"
          :class="isLight ? 'text-sky-500' : 'text-sky-300'"
        />
      </GridLayout>
    </template>

    <template #default>
      <GridLayout
        rows="auto *"
        ~mainContent
        class="py-4"
        padding="10"
        :backgroundColor="isLight ? 'rgb(249, 250, 251)' : '#101622'"
      >
        <Label :text="pageTitle" class="my-10 pl-4">
          <FormattedString>
            <Span
              :text="pageTitle"
              class="text-lg text-neutral-600 dark:text-neutral-300"
            />
          </FormattedString>
        </Label>
        <ListView
          row="1"
          :items="detectionsWithResolvedImages"
          @itemTap="handleItemTap"
          class="h-full mx-4"
          separatorColor="transparent"
        >
          <template #default="{ item }: { item: IDetection }">
            <StackLayout>
              <GridLayout
                columns="auto 200 * auto auto"
                class="mb-5 p-2 bg-neutral-100 dark:bg-neutral-800 card"
                :borderColor="
                  isLight ? 'rgb(243, 244, 246)' : 'rgba(255, 255, 255, .05)'
                "
                :backgroundColor="
                  isLight ? 'rgba(255, 255, 255)' : 'rgba(255, 255, 255, 0.03)'
                "
              >
                <Image
                  :src="item.imageUrl"
                  row="0"
                  col="0"
                  class="rounded-lg align-middle avatar"
                  :borderColor="
                    isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, .30)'
                  "
                />

                <Label
                  col="1"
                  textWrap="true"
                  class="text-sm pl-2 mt-2 align-middle"
                  :color="isLight ? 'rgb(31, 41, 55)' : '#fff'"
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

                <Label
                  col="4"
                  text="&#xf054;"
                  class="fas text-lg"
                  :color="isLight ? 'rgb(156, 163, 175)' : 'rgb(71, 85, 105)'"
                />
              </GridLayout>
            </StackLayout>
          </template>
        </ListView>
      </GridLayout>
    </template>
  </SCPage>
</template>

<style lang="css" scoped>
.card {
  border-radius: 16;
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);

  border-width: 1;
  padding: 10;
  margin: 5;
}

.card-colors {
  background-color: #f7f7f7; /* Very light gray */
  border-color: #e5e5e5;
}

.card-colors-dark {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
}

.avatar {
  border-radius: 100;
  border-width: 1;
  width: 50;
  height: 50;
  margin-right: 10;
}

.avatar-colors {
  background-color: #f7f7f7; /* Very light gray */
  border-color: #e5e5e5;
}

.avatar-colors-dark {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.05);
}
</style>
