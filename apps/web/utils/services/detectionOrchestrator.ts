import { getDetectionService } from '~/utils/services/getDetectionService';
import { captureImageFromVideoAndBoundingBoxValues } from '~/utils/detection/imageExtractor';
import type { IStorageService } from '~/core/contracts/storage.contract';
import { getStorageService } from '~/utils/services';
import type { DetectedObject } from '@tensorflow-models/coco-ssd';
import type { IDetectionService } from '~/core/contracts';

export interface IDetectionOrchestrator {
  startMonitoring(video: HTMLVideoElement, userId: string): Promise<void>;
  stopMonitoring(): void;
  onPersonDetected(callback: (imageUrl: string) => void): void;
}

export class DetectionOrchestrator implements IDetectionOrchestrator {
  private detectionService: IDetectionService;
  private storageService: IStorageService;
  private currentUserId: string | null = null;
  private currentVideo: HTMLVideoElement | null = null;
  private onDetectedCallback?: (imageUrl: string) => void;

  private detectionCooldownMs: number;
  private lastDetectionTimestamp: number = 0;

  constructor(
    detectionService: IDetectionService,
    storageService: IStorageService,
    detectionCooldownMs = 3000
  ) {
    this.detectionService = detectionService;
    this.storageService = storageService;
    this.detectionCooldownMs = detectionCooldownMs;

    // Set up detection callback
    this.detectionService.onDetection(async (detections: DetectedObject[]) => {
      for (const detection of detections) {
        if (detection.class === 'person' && detection.score > 0.66) {
          await this.handlePersonDetected(detection);
        }
      }
    });
  }

  async startMonitoring(
    video: HTMLVideoElement,
    userId: string
  ): Promise<void> {
    this.currentUserId = userId;
    this.currentVideo = video;
    await this.detectionService.startDetection(video);
  }

  stopMonitoring(): void {
    this.detectionService.stopDetection();
    this.currentUserId = null;
    this.currentVideo = null;
  }

  private async handlePersonDetected(detection: DetectedObject): Promise<void> {
    if (!this.currentVideo || !this.currentUserId) return;

    const now = Date.now();
    if (now - this.lastDetectionTimestamp < this.detectionCooldownMs) {
      // Still in cooldown period
      return;
    }
    this.lastDetectionTimestamp = now;

    try {
      const blob = await captureImageFromVideoAndBoundingBoxValues(
        detection.bbox,
        this.currentVideo
      );

      if (blob) {
        const imageUrl = await this.storageService.uploadImage(
          this.currentUserId,
          blob
        );

        console.log(`Person detected! Image uploaded: ${imageUrl}`);
        this.onDetectedCallback?.(imageUrl);
      }
    } catch (error) {
      console.error('Error handling person detection:', error);
    }
  }

  onPersonDetected(callback: (imageUrl: string) => void): void {
    this.onDetectedCallback = callback;
  }
}

export function getDetectionOrchestrator(): IDetectionOrchestrator {
  const detectionService = getDetectionService();
  const storageService = getStorageService();

  return new DetectionOrchestrator(detectionService, storageService, 3000);
}
