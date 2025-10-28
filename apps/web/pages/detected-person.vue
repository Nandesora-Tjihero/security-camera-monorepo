<template>
  <div>
    <BaseHeading class="mb-5">Person Detected</BaseHeading>
    <img
      :src="notification.data?.imgURL"
      alt="Detected person"
      class="rounded-lg"
    />
  </div>
</template>
<script setup lang="ts">
import type { MessagePayload } from 'firebase/messaging';
const notification = ref({} as MessagePayload);
onMounted(async () => {
  const notificationFromState = useState<MessagePayload>('notification').value;
  if (!notificationFromState) {
    await navigateTo('/dashboard');
  }
  notification.value = notificationFromState;
});
</script>
