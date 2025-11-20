import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTfjsDetector, model } from '#layers/detection/app/utils/tfjs';
import type { DetectedObject } from '~~/shared/core/models';

describe('getTfjsDetector', () => {
  let service: ReturnType<typeof getTfjsDetector>;
  const detectionCooldownMs = 1000;
  const mockVideo = {} as HTMLVideoElement;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    service = getTfjsDetector(detectionCooldownMs);
  });

  it('throws if model not loaded', async () => {
    model.value = null;

    await expect(service.startDetection(mockVideo)).rejects.toThrow(
      'Model not loaded'
    );
  });

  it('calls detection callback only for confident persons', async () => {
    const mockCallback = vi.fn();

    model.value = {
      load: vi.fn(),
      dispose: vi.fn(),
      detect: vi
        .fn<(img: HTMLVideoElement) => Promise<DetectedObject[]>>()
        .mockResolvedValue([
          { class: 'person', score: 0.9, bbox: [0, 0, 0, 0] },
          { class: 'dog', score: 0.9, bbox: [0, 0, 0, 0] },
          { class: 'person', score: 0.4, bbox: [0, 0, 0, 0] },
        ]),
    };

    const rafSpy = vi
      .spyOn(global, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        // prevent infinite loop
        return 1;
      });

    service.onDetection(mockCallback);

    await service.startDetection(mockVideo);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      class: 'person',
      score: 0.9,
      bbox: [0, 0, 0, 0],
    });

    expect(model.value.detect).toHaveBeenCalledOnce();
    expect(rafSpy).toHaveBeenCalled();
  });

  it('respects cooldown', async () => {
    model.value = {
      load: vi.fn(),
      dispose: vi.fn(),
      detect: vi
        .fn<(img: HTMLVideoElement) => Promise<DetectedObject[]>>()
        .mockResolvedValue([]),
    };

    const rafSpy = vi
      .spyOn(global, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        return 1;
      });

    service.startDetection(mockVideo);
    expect(model.value.detect).toHaveBeenCalledTimes(1);

    // Move time forward but still within cooldown
    vi.setSystemTime(Date.now() + detectionCooldownMs - 1);

    service.startDetection(mockVideo);
    expect(model.value.detect).toHaveBeenCalledTimes(1); // unchanged
  });

  it('stopDetection cancels animation loop', async () => {
    const cancelSpy = vi
      .spyOn(global, 'cancelAnimationFrame')
      .mockImplementation(() => {});

    vi.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
      // prevent infinite loop
      return 123;
    });

    await service.startDetection(mockVideo);

    service.stopDetection();

    expect(cancelSpy).toHaveBeenCalledWith(123);
  });
});
