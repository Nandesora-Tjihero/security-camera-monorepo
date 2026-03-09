import { toRaw } from 'vue';

import type {
  DetectedObject,
  ObjectDetection,
} from '@tensorflow-models/coco-ssd';
import type { IDetectionService } from '#shared/core/contracts';

export const model = shallowRef<ObjectDetection | null>(null);
export const loadingModel = ref<boolean>(false);

export async function loadModel() {
  try {
    if (!model.value) {
      loadingModel.value = true;
      console.time('loadModel');
      // Dynamic imports for lazy loading
      // These will only download when loadModel is called
      await import('@tensorflow/tfjs-backend-cpu');
      await import('@tensorflow/tfjs-backend-webgl');
      const { load } = await import('@tensorflow-models/coco-ssd');

      model.value = await load();
    }
    console.timeEnd('loadModel');
    return model;
  } catch (error: any) {
    throw createError({
      name: 'ML Model Availability Check',
      message: error instanceof Error ? error.message : String(error),
    });
  } finally {
    loadingModel.value = false;
  }
}

export interface IScheduler {
  request(callback: FrameRequestCallback): number;
  cancel(handle: number): void;
}

export interface IModelLoader {
  load(): Promise<Ref<ObjectDetection | null>>;
  get(): ObjectDetection | null;
}

const defaultScheduler: IScheduler = {
  request: (cb) => requestAnimationFrame(cb),
  cancel: (id) => cancelAnimationFrame(id),
};

const defaultModelLoader: IModelLoader = {
  load: loadModel,
  get: () => model.value,
};

export function getTfjsDetector(
  detectionCooldownMs = 5000,
  confidenceThreshold = 0.66,
  deps: { scheduler?: IScheduler; modelLoader?: IModelLoader } = {},
): IDetectionService {
  const { scheduler = defaultScheduler, modelLoader = defaultModelLoader } =
    deps;

  let requestAnimationFrameId: number | null = null;
  let detectionCallback: ((detections: DetectedObject) => void) | null = null;

  let lastDetectionTimestamp: number = 0;

  const startDetection = async (video: HTMLVideoElement) => {
    // Use injected modelLoader
    if (!modelLoader.get()) {
      await modelLoader.load();
    }

    const currentModel = modelLoader.get();

    if (!currentModel) {
      throw new Error('Model failed to load');
    }

    try {
      const rawModel = toRaw(currentModel);

      const now = Date.now();
      console.log('Now timestamp:', now);
      if (now - lastDetectionTimestamp < detectionCooldownMs) {
        // Still in cooldown period
        requestAnimationFrameId = scheduler.request(() =>
          startDetection(video),
        );
        return;
      }
      lastDetectionTimestamp = now;

      try {
        const detectedObjects = await rawModel.detect(video);

        // PERFORMANCE MEASUREMENT: Detection Availability (Success)
        console.debug(
          JSON.stringify({
            metric: 'detection_availability',
            status: 'success',
            timestamp: Date.now(),
          }),
        );

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
      } catch (detectError) {
        // PERFORMANCE MEASUREMENT: Detection Availability (Failure)
        console.error(
          JSON.stringify({
            metric: 'detection_availability',
            status: 'error',
            error: detectError,
            timestamp: Date.now(),
          }),
        );
        throw detectError; // Re-throw to hit the outer catch block
      }

      requestAnimationFrameId = scheduler.request(() => startDetection(video));
    } catch (error) {
      console.error('Error in startDetection', error);
      // If the loop crashes completely, that's a critical availability failure
      console.error(
        JSON.stringify({
          metric: 'detection_availability',
          status: 'CRITICAL_CRASH',
          timestamp: Date.now(),
        }),
      );
    }
  };

  const stopDetection = () => {
    if (requestAnimationFrameId) {
      scheduler.cancel(requestAnimationFrameId);
      requestAnimationFrameId = null;
    }
  };

  const onDetection = (callback: (detections: DetectedObject) => void) => {
    detectionCallback = callback;
  };

  return { startDetection, stopDetection, onDetection };
}
