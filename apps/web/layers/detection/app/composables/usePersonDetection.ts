import {
  getDetectionService,
  getStorageService,
} from '~~/layers/01-base/app/utils/services';
import type { DetectedObject } from '~~/shared/core/models';

export function usePersonDetection() {
  const mediaStream = ref<MediaStream | null>(null);
  const webcamStream = ref<HTMLVideoElement | null>(null);
  const isMonitoring = ref(false);
  const webcamStreamReady = ref(false);

  const { canMonitor, user } = useUser();

  // Services
  const detectionService = getDetectionService();
  const storageService = getStorageService();

  const setupMonitoring = async () => {
    try {
      // Setup webcam
      mediaStream.value = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
    } catch (err) {
      console.error('Error setting up monitoring: ', err);
    }
  };

  const startMonitoring = async () => {
    if (webcamStream.value && webcamStreamReady.value && user.value) {
      detectionService.startDetection(webcamStream.value);
      webcamStream.value.play();
      isMonitoring.value = true;
    }
  };

  const stopMonitoring = async () => {
    detectionService.stopDetection();
    isMonitoring.value = false;
    webcamStream.value?.pause();
  };

  const handleLoadedData = () => {
    webcamStreamReady.value = true;
  };

  const handlePersonDetected = async (
    detection: DetectedObject
  ): Promise<void> => {
    try {
      const blob = await captureImageFromVideoAndBoundingBoxValues(
        detection.bbox,
        webcamStream.value
      );

      if (blob && user.value) {
        const imageUrl = await storageService.uploadImage(user.value.uid, blob);

        console.log(`Person detected! Image uploaded: ${imageUrl}`);
      }
    } catch (error) {
      console.error('Error handling person detection:', error);
    }
  };

  onMounted(setupMonitoring);

  return {
    mediaStream,
    webcamStream,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    handleLoadedData,
    handlePersonDetected,
  };
}
