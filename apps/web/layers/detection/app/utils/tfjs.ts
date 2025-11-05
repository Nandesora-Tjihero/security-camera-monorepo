import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';

import { load } from '@tensorflow-models/coco-ssd';
import { toRaw } from 'vue';

import type { ObjectDetection } from '@tensorflow-models/coco-ssd';
import type { IDetectionService } from '#shared/core/contracts';

export const model: Ref<ObjectDetection | null> = ref(null);

export async function loadModel() {
  if (!model.value) {
    model.value = await load();
  }
  return model;
}

export function getTfjsDetector(): IDetectionService {
  let requestAnimationFrameId: number | null = null;
  let detectionCallback: ((detections: any[]) => void) | null = null;

  const startDetection = async (video: HTMLVideoElement) => {
    if (!model.value) {
      throw new Error('Model not loaded');
    }

    try {
      const rawModel = toRaw(model.value);
      const detectedObjects = await rawModel.detect(video);

      // Let the orchestrator handle the filtering and business logic
      if (detectionCallback && detectedObjects.length > 0) {
        detectionCallback(detectedObjects);
      }

      requestAnimationFrameId = requestAnimationFrame(() =>
        startDetection(video)
      );
    } catch (error) {
      console.error('Error in startDetection', error);
    }
  };

  const stopDetection = () => {
    if (requestAnimationFrameId) {
      cancelAnimationFrame(requestAnimationFrameId);
      requestAnimationFrameId = null;
    }
  };

  const onDetection = (callback: (detections: any[]) => void) => {
    detectionCallback = callback;
  };

  return { startDetection, stopDetection, onDetection };
}
