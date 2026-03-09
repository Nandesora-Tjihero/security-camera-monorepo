export const useDetectionState = () => {
  return {
    isMonitoring: useState<boolean>("isMonitoring", () => false),
    webcamStreamReady: useState<boolean>("webcamStreamReady", () => false),
  };
};
