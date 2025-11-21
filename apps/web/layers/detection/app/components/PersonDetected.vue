<template>
  <section>
    <p
      v-if="!hasNotificationDevice"
      class="text-yellow-500 mb-5"
      data-test="no-device-registered"
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
      class="bg-gray-200 block mt-5 max-h-[20rem] w-[35rem] aspect-video object-cover"
    ></video>
  </section>
</template>

<script setup lang="ts">
  const {
    mediaStream,
    webcamStream,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    handleLoadedData,
  } = usePersonDetection();

  const { canMonitor, hasNotificationDevice, user, setHasNotificationDevice } =
    useUser();

  onMounted(() => {
    if (!hasNotificationDevice.value) {
      // initiate SSE connection to listen for device registration events
      const eventSource = new EventSource(`/api/sse/${user.value?.uid}`);
      eventSource.onmessage = (event) => {
        const json = JSON.parse(event.data) as {
          data: { event: string; userId: string; tokens: string[] };
        };
        console.log(
          'SSE event data:',
          json.data.event === 'REGISTER_NOTIFICATION_DEVICE' &&
            json.data.tokens,
          json
        );
        if (
          json.data.event === 'REGISTER_NOTIFICATION_DEVICE' &&
          json.data.tokens
        ) {
          console.log('SSE message received:', json);

          setHasNotificationDevice(json.data.tokens.length > 0);
          // eventSource.close();
        }
      };
    }
  });
</script>
