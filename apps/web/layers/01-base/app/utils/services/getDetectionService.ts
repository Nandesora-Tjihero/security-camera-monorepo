import type { DetectedObject } from '@tensorflow-models/coco-ssd';
import type { IDetectionService } from '#shared/core/contracts';
import { getTfjsDetector } from '~~/layers/detection/app/utils/tfjs';

export const getDetectionService = (): IDetectionService => {
  return getTfjsDetector();
};
