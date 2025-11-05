import type { MLDetection } from '../models/detection.model';

export interface AppEvents {
  detected: MLDetection;
  error: Error;
}
