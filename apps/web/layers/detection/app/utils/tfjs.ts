import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';

import { load } from '@tensorflow-models/coco-ssd';
import { toRaw } from 'vue';

import type { ObjectDetection } from '@tensorflow-models/coco-ssd';
import type { IDetectionService } from '#shared/core/contracts';

export const model = ref<ObjectDetection | null>(null);
export const loadingModel = ref<boolean>(false);

export async function loadModel() {
  try {
    if (!model.value) {
      loadingModel.value = true;
      model.value = await load();
    }
    return model;
  } catch (error: any) {
    throw createError({ name: 'ML Model Availability Check', message: error });
  } finally {
    loadingModel.value = false;
  }
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
