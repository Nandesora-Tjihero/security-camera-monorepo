import { getDetectionOrchestrator } from '~/utils/services/detectionOrchestrator';

export function usePersonDetection() {
  const mediaStream = ref<MediaStream | null>(null);
  const webcamStream = ref<HTMLVideoElement | null>(null);
  const isMonitoring = ref(false);
  const webcamStreamReady = ref(false);

  const { canMonitor, user } = useUser();

  // Create orchestrator instance
  const orchestrator = getDetectionOrchestrator();

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
    console.log('Starting monitoring for user:', user.value?.uid);

    if (webcamStream.value && webcamStreamReady.value && user.value) {
      await orchestrator.startMonitoring(webcamStream.value, user.value.uid);
      webcamStream.value.play();
      isMonitoring.value = true;
    }
  };

  const stopMonitoring = async () => {
    orchestrator.stopMonitoring();
    isMonitoring.value = false;
    webcamStream.value?.pause();
  };

  const handleLoadedData = () => {
    webcamStreamReady.value = true;
  };

  const onPersonDetected = (callback: (imageUrl: string) => void) => {
    orchestrator.onPersonDetected(callback);
  };

  onMounted(setupMonitoring);

  return {
    mediaStream,
    webcamStream,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    handleLoadedData,
    onPersonDetected,
  };
}
