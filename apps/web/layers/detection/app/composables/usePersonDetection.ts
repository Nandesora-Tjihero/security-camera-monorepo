import {
  getDetectionService,
  getStorageService,
  getDatabaseService,
} from '~~/layers/01-base/app/utils/services';
import type { DetectedObject } from '~~/shared/core/models';

// Hardware refs are kept at module level to act as singletons
// across the app, while useState handles the reactive UI state.
const mediaStream = ref<MediaStream | null>(null);
const webcamStream = ref<HTMLVideoElement | null>(null);
let isListenerAttached = false;
let heartbeatInterval: any = null;

export function usePersonDetection() {
  const state = useDetectionState();
  const { user } = useUser();
  const detectionService = getDetectionService();
  const storageService = getStorageService();
  const databaseService = getDatabaseService();

  const handlePersonDetected = async (
    detection: DetectedObject,
  ): Promise<void> => {
    try {
      const blob = await captureImageFromVideoAndBoundingBoxValues(
        detection.bbox,
        webcamStream.value,
      );

      if (blob && user.value) {
        const imageUrl = await storageService.uploadImage(user.value.uid, blob);
        console.log(`Person detected! Image uploaded: ${imageUrl}`);
      }
    } catch (error) {
      console.error('Error handling person detection:', error);
    }
  };

  // Ensure we only attach the listener once for the singleton service
  if (!isListenerAttached) {
    detectionService.onDetection(handlePersonDetected);
    isListenerAttached = true;
  }

  const setupMonitoring = async () => {
    if (mediaStream.value) return; // Already setup

    try {
      mediaStream.value = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
    } catch (err) {
      console.error('Error setting up monitoring: ', err);
    }
  };

  let wakeLock: WakeLockSentinel | null = null;
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock is active 🛡️');
      }
    } catch (err: any) {
      console.error(`${err?.name}, ${err?.message}`);
    }
  };

  const startHeartbeat = () => {
    if (heartbeatInterval) return;
    heartbeatInterval = setInterval(async () => {
      if (user.value) {
        await databaseService.addDataToDocForUser('users', user.value.uid, {
          lastActive: Date.now(),
        });
        console.log('Heartbeat sent ❤️');
      }
    }, 60000); // Every minute
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  };

  const startMonitoring = async () => {
    if (webcamStream.value && state.webcamStreamReady.value && user.value) {
      await requestWakeLock();
      startHeartbeat();
      detectionService.startDetection(webcamStream.value);
      webcamStream.value.play();
      state.isMonitoring.value = true;
    }
  };

  const stopMonitoring = async () => {
    detectionService.stopDetection();
    state.isMonitoring.value = false;
    webcamStream.value?.pause();
    stopHeartbeat();

    if (wakeLock !== null) {
      await wakeLock.release();
      wakeLock = null;
      console.log('Wake Lock released 🔓');
    }
  };

  const handleLoadedData = () => {
    state.webcamStreamReady.value = true;
  };

  onMounted(setupMonitoring);

  onUnmounted(() => {
    stopHeartbeat();
  });

  return {
    ...state,
    mediaStream,
    webcamStream,
    startMonitoring,
    stopMonitoring,
    handleLoadedData,
  };
}
