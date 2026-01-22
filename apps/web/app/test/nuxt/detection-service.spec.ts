import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, type Ref } from "vue";
import { getTfjsDetector } from "#layers/detection/app/utils/tfjs";
import type {
  IScheduler,
  IModelLoader,
} from "#layers/detection/app/utils/tfjs";
import type {
  DetectedObject,
  ObjectDetection,
} from "@tensorflow-models/coco-ssd";

// Mock dependencies
const mockVideo = {} as HTMLVideoElement;

describe("getTfjsDetector (Factory Pattern)", () => {
  let mockScheduler: IScheduler;
  let mockModelLoader: IModelLoader;
  let mockModel: ObjectDetection;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();

    // 1. Mock Scheduler (replaces global requestAnimationFrame)
    mockScheduler = {
      request: vi.fn().mockReturnValue(123),
      cancel: vi.fn(),
    };

    // 2. Mock Model
    mockModel = {
      detect: vi.fn(),
      load: vi.fn(),
      dispose: vi.fn(),
    } as unknown as ObjectDetection;

    // 3. Mock ModelLoader (replaces global model state)
    mockModelLoader = {
      load: vi.fn(async () => {
        return ref(mockModel) as Ref<ObjectDetection | null>;
      }),
      get: vi.fn().mockReturnValue(mockModel),
    };
  });

  it("throws if model fails to load (using injected loader)", async () => {
    // Simulate loader failing or returning null
    mockModelLoader.get = vi.fn().mockReturnValue(null);
    mockModelLoader.load = vi.fn(async () => {
      // Simulate load completing but still no model, or throwing
      return ref(null) as Ref<ObjectDetection | null>;
    });

    const service = getTfjsDetector(1000, 0.6, {
      scheduler: mockScheduler,
      modelLoader: mockModelLoader,
    });

    await expect(service.startDetection(mockVideo)).rejects.toThrow(
      "Model failed to load",
    );
    expect(mockModelLoader.load).toHaveBeenCalled();
  });

  it("uses injected scheduler for the detection loop", async () => {
    (mockModel.detect as any).mockResolvedValue([]);

    const service = getTfjsDetector(1000, 0.6, {
      scheduler: mockScheduler,
      modelLoader: mockModelLoader,
    });

    await service.startDetection(mockVideo);

    // Should have called request on our mock scheduler
    expect(mockScheduler.request).toHaveBeenCalled();

    // Should NOT have called the global one (optional verification, checking usage of mock is enough)
  });

  it("respects cooldown using injected dependency timing", async () => {
    const cooldown = 1000;
    (mockModel.detect as any).mockResolvedValue([]);

    const service = getTfjsDetector(cooldown, 0.6, {
      scheduler: mockScheduler,
      modelLoader: mockModelLoader,
    });

    // 1st call
    await service.startDetection(mockVideo);
    expect(mockModel.detect).toHaveBeenCalledTimes(1);

    // Fast forward time slightly (still in cooldown)
    vi.setSystemTime(Date.now() + 100);

    // 2nd call (simulated by loop)
    await service.startDetection(mockVideo);

    // Since we are in cooldown, detect should NOT be called again
    expect(mockModel.detect).toHaveBeenCalledTimes(1);

    // But scheduler should be called to keep loop alive
    expect(mockScheduler.request).toHaveBeenCalledTimes(2);
  });

  it("filters detections based on logic (independent of factory)", async () => {
    const mockCallback = vi.fn();
    (mockModel.detect as any).mockResolvedValue([
      { class: "person", score: 0.9, bbox: [0, 0, 0, 0] },
      { class: "dog", score: 0.9, bbox: [0, 0, 0, 0] },
    ]);

    const service = getTfjsDetector(1000, 0.5, {
      scheduler: mockScheduler,
      modelLoader: mockModelLoader,
    });
    service.onDetection(mockCallback);

    await service.startDetection(mockVideo);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({ class: "person" }),
    );
  });
});
