import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';

import { load } from '@tensorflow-models/coco-ssd';
import { toRaw } from 'vue';

import type {
  DetectedObject,
  ObjectDetection,
} from '@tensorflow-models/coco-ssd';
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

export function getTfjsDetector(
  detectionCooldownMs: number,
  confidenceThreshold = 0.66
): IDetectionService {
  let requestAnimationFrameId: number | null = null;
  let detectionCallback: ((detections: DetectedObject) => void) | null = null;

  let lastDetectionTimestamp: number = 0;

  const startDetection = async (video: HTMLVideoElement) => {
    if (!model.value) {
      throw new Error('Model not loaded');
    }

    try {
      const rawModel = toRaw(model.value);

      const now = Date.now();
      console.log('Now timestamp:', now);
      if (now - lastDetectionTimestamp < detectionCooldownMs) {
        // Still in cooldown period
        return;
      }
      lastDetectionTimestamp = now;

      const detectedObjects = await rawModel.detect(video);

      if (detectionCallback && detectedObjects.length > 0) {
        for (const detection of detectedObjects) {
          if (
            detection.class === 'person' &&
            detection.score > confidenceThreshold
          ) {
            detectionCallback(detection);
          }
        }
      }

      requestAnimationFrameId = requestAnimationFrame(() =>
        startDetection(video)
      );
    } catch (error) {
      console.error('Error in startDetection', error);
    }
    console.log('requestAnimationFrameId', requestAnimationFrameId);
  };

  const stopDetection = () => {
    if (requestAnimationFrameId) {
      cancelAnimationFrame(requestAnimationFrameId);
      requestAnimationFrameId = null;
    }
  };

  const onDetection = (callback: (detections: DetectedObject) => void) => {
    detectionCallback = callback;
  };

  return { startDetection, stopDetection, onDetection };
}
