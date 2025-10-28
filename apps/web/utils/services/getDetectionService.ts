import type { DetectedObject } from '@tensorflow-models/coco-ssd';
import type { IDetectionService } from '~/core/contracts';
import { getTfjsDetector } from '~/utils/detection/tfjs';

export const getDetectionService = (): IDetectionService => {
  return getTfjsDetector();
};
