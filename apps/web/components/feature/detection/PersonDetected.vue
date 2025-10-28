<template>
  <section>
    <p
      v-if="!userComposable.hasNotificationDevice.value"
      class="text-yellow-500 mb-5"
    >
      Please add a notification device from the mobile app to enable monitoring.
    </p>
    <UButton
      label="Start Monitoring"
      @click="startMonitoring"
      :disabled="!canMonitor || isMonitoring"
      class="inline-block mr-5"
    />
    <UButton
      label="Stop Monitoring"
      @click="stopMonitoring"
      :disabled="!isMonitoring"
    />

    <video
      ref="webcamStream"
      autoplay
      muted
      :srcObject="mediaStream"
      @loadeddata="handleLoadedData"
      width="560"
      height="320"
      class="bg-gray-200 rounded-lg block mt-5 max-h-[20rem] w-[35rem] aspect-video object-cover"
    ></video>
  </section>
</template>

<script setup lang="ts">
  const userComposable = useUser();

  onMounted(() => {
    if (!userComposable.hasNotificationDevice.value) {
      // initiate SSE connection to register notification device
      const eventSource = new EventSource(
        `/api/sse?userId=${userComposable.user.value?.uid}`
      );
      eventSource.onmessage = (event) => {
        const json = JSON.parse(event.data);
        console.log(
          'SSE event data:',
          json.data.type === 'REGISTER_NOTIFICATION_DEVICE' && json.data.tokens,
          json
        );
        if (json.type === 'REGISTER_NOTIFICATION_DEVICE' && json.data.tokens) {
          console.log('SSE message received:', json);

          userComposable.setHasNotificationDevice(json.data.tokens.length > 0);
          // eventSource.close();
        }
      };
    }
  });

  const {
    mediaStream,
    webcamStream,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    handleLoadedData,
    onPersonDetected,
  } = usePersonDetection();

  const { canMonitor } = useUser();
  // Handle person detection events
  onPersonDetected((imageUrl: string) => {
    console.log(`Person detected! Image saved: ${imageUrl}`);
    // Add any UI notifications here
  });
</script>
