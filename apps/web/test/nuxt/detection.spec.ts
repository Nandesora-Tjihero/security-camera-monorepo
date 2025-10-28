import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { IDetectionService } from '~/core/contracts';

import { DetectionOrchestrator } from '~/utils/services/detectionOrchestrator';
import { getDetectionService } from '~/utils/services/getDetectionService';
import { getStorageService } from '~/utils/services/getStorageService';
import { captureImageFromVideoAndBoundingBoxValues } from '~/utils/detection/imageExtractor';

// Mock Firebase Auth

const mockStartDetection = vi.fn(async (video: HTMLVideoElement) => {});
const mockStopDetection = vi.fn(() => {});
const mockOnDetection = vi.fn();

const mockUploadImage = vi.fn(async (userId: string, blob: Blob) => {
  return `https://storage.service/${userId}/image.jpg`;
});

vi.mock('~/utils/services/getDetectionService', () => ({
  getDetectionService: vi.fn(() => ({
    startDetection: mockStartDetection,
    stopDetection: mockStopDetection,
    onDetection: mockOnDetection,
  })),
}));

vi.mock('~/utils/services/getStorageService', () => ({
  getStorageService: vi.fn(() => ({
    uploadImage: mockUploadImage,
  })),
}));

vi.mock('~/utils/detection/imageExtractor', () => {
  return {
    captureImageFromVideoAndBoundingBoxValues: vi.fn(
      async (bbox: number[], video: HTMLVideoElement) => {
        return new Blob(['mock image data'], { type: 'image/jpeg' });
      }
    ),
  };
});
//
const NO_DEVICE_REGISTERED_MESSAGE =
  'No notification device registered. Use the mobile app(<insert link to app>) to register a device for notifications.';

describe('DetectionOrchestrator', () => {
  let orchestrator: DetectionOrchestrator;
  let detectionService: IDetectionService;
  let storageService: ReturnType<typeof getStorageService>;
  let videoElement: HTMLVideoElement;

  beforeEach(() => {
    detectionService = getDetectionService();
    storageService = getStorageService();
    orchestrator = new DetectionOrchestrator(
      detectionService,
      storageService,
      100
    );
    videoElement = document.createElement('video');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.todo(
    'if user has not registered a notification device, detection should not start and a message instructing them to register should be shown',
    async () => {}
  );

  it('should start monitoring and call startDetection', async () => {
    await orchestrator.startMonitoring(videoElement, 'user123');
    expect(mockStartDetection).toHaveBeenCalledWith(videoElement);
  });

  it('should stop monitoring and call stopDetection', () => {
    orchestrator.stopMonitoring();
    expect(mockStopDetection).toHaveBeenCalled();
  });

  it('should throttle detection to upload one image per cooldown period', async () => {
    // Use fake timers so we can advance Date.now() deterministically
    const realNow = Date.now();
    vi.useFakeTimers();
    // initialize fake Date to current real time
    vi.setSystemTime(realNow);
    // Clear previous mock call history so we can capture the new orchestrator's registration
    vi.clearAllMocks();

    const COOL_DOWN_MS = 100;
    orchestrator = new DetectionOrchestrator(
      detectionService,
      storageService,
      COOL_DOWN_MS
    );

    // the orchestrator constructor should have registered the detection callback
    const detectionCallback = (mockOnDetection as any).mock.calls[0]?.[0];
    await orchestrator.startMonitoring(videoElement, 'user123');

    const mockDetections = [
      { class: 'person', score: 0.8, bbox: [10, 10, 100, 200] },
    ];

    // First detection - should upload
    await detectionCallback(mockDetections);
    expect(mockUploadImage).toHaveBeenCalledTimes(1);

    // Immediate second detection - should be throttled
    await detectionCallback(mockDetections);
    expect(mockUploadImage).toHaveBeenCalledTimes(1);

    // Move the fake system time forward past the cooldown window
    vi.setSystemTime(realNow + COOL_DOWN_MS + 1);

    // Third detection after cooldown - should upload again
    await detectionCallback(mockDetections);
    expect(mockUploadImage).toHaveBeenCalledTimes(2);

    // restore real timers
    vi.useRealTimers();
  });

  it('should handle person detection and upload image', async () => {
    const detectionCallback = mockOnDetection.mock.calls[0][0];

    await orchestrator.startMonitoring(videoElement, 'user123');

    const mockDetections = [
      { class: 'person', score: 0.8, bbox: [10, 10, 100, 200] },
      { class: 'cat', score: 0.9, bbox: [50, 50, 80, 80] },
    ];

    await detectionCallback(mockDetections);

    expect(captureImageFromVideoAndBoundingBoxValues).toHaveBeenCalledWith(
      [10, 10, 100, 200],
      videoElement
    );
    expect(mockUploadImage).toHaveBeenCalledWith('user123', expect.any(Blob));
  });

  it('should not upload image for non-person detections', async () => {
    const detectionCallback = mockOnDetection.mock.calls[0][0];

    await orchestrator.startMonitoring(videoElement, 'user123');

    const mockDetections = [
      { class: 'dog', score: 0.85, bbox: [20, 20, 150, 150] },
    ];

    await detectionCallback(mockDetections);

    expect(captureImageFromVideoAndBoundingBoxValues).not.toHaveBeenCalled();
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  it('should not upload image for low confidence person detections', async () => {
    const detectionCallback = mockOnDetection.mock.calls[0][0];

    await orchestrator.startMonitoring(videoElement, 'user123');

    const mockDetections = [
      { class: 'person', score: 0.5, bbox: [15, 15, 120, 220] },
    ];

    await detectionCallback(mockDetections);

    expect(captureImageFromVideoAndBoundingBoxValues).not.toHaveBeenCalled();
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  it('throttles detection', () => {});
});
