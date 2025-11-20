import type { DetectedObject } from '@tensorflow-models/coco-ssd';

export interface IDetectionService {
  startDetection(video: HTMLVideoElement): Promise<void>;
  stopDetection(): void;
  onDetection(callback: (detections: DetectedObject) => void): void;
}
