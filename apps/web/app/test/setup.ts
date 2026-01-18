import { vi } from "vitest";
import type { IDatabaseService } from "#shared/core/contracts/database.contract";

import { afterAll, afterEach, beforeAll } from "vitest";
import { createFetch } from "ofetch";

// Polyfill EventSource for MSW
global.EventSource = class EventSource {
  onopen: ((this: EventSource, ev: Event) => any) | null = null;
  onmessage: ((this: EventSource, ev: MessageEvent) => any) | null = null;
  onerror: ((this: EventSource, ev: Event) => any) | null = null;
  readonly CLOSED = 2;
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly readyState = 0;
  readonly url: string;
  readonly withCredentials: boolean;

  constructor(url: string, eventSourceInitDict?: EventSourceInit) {
    this.url = url || "";
    this.withCredentials = eventSourceInitDict?.withCredentials ?? false;
  }

  close(): void {}
  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean {
    return false;
  }
} as any;

// Dynamic import to ensure EventSource is defined before MSW initializes
const { server } = await import("./mocks/server");

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  (globalThis as any).$fetch = createFetch();
});

// Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers());

vi.mock("#layers/01-base/app/utils/services", async () => {
  const mockGetUserById = vi.fn(async (uid: string) => null);
  const mockCreateUser = vi.fn(async (user: any) => ({ ...user }));
  const mockGetSubscription = vi.fn(async (uid: string) => null);

  const mockSignInWithGoogle = vi.fn(async () => ({
    uid: "12345",
    email: "testuser@gmail.com",
    displayName: "Test User",
    getIdToken: vi.fn(async () => "mock-id-token"),
  }));
  const mockConvertToScUser = vi.fn((user: any) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }));

  return {
    getDatabaseService: vi.fn(() => ({
      getUserById: mockGetUserById,
      createUser: mockCreateUser,
      getSubscription: mockGetSubscription,
    })),
    getAuthService: vi.fn(() => ({
      signInWithGoogle: mockSignInWithGoogle,
      convertToScUser: mockConvertToScUser,
    })),
    getBillingService: vi.fn(() => ({ createCheckoutSession: vi.fn() })),
    getStorageService: vi.fn(() => ({
      uploadImage: vi.fn(async (userId: string, blob: Blob) => {
        return `https://storage.service/${userId}/image.jpg`;
      }),
      getImageUrl: vi.fn(),
    })),
    getDetectionService: vi.fn(() => ({
      startDetection: vi.fn(async (video: HTMLVideoElement) => {}),
      stopDetection: vi.fn(() => {}),
      onDetection: vi.fn(),
    })),
    DetectionOrchestrator: vi.fn(function (
      this: any,
      detectionService?: any,
      storageService?: any,
      detectionCooldownMs?: number
    ) {
      // store constructor args on the instance for assertions
      this._detectionService = detectionService;
      this._storageService = storageService;
      this._cooldown = detectionCooldownMs ?? 10000;

      // instance spies
      this.startMonitoring = vi.fn(
        async (video?: HTMLVideoElement, userId?: string) => {
          this.__video = video;
          this.__userId = userId;
        }
      );

      this.stopMonitoring = vi.fn(() => {
        this.__video = null;
        this.__userId = null;
      });

      this.onPersonDetected = vi.fn((cb: (imageUrl: string) => void) => {
        this._personCb = cb;
      });

      // test helper to simulate a detection callback
      this.triggerPersonDetected = vi.fn(async (imageUrl: string) => {
        if (typeof this._personCb === "function") {
          await this._personCb(imageUrl);
        }
      });
    }),
  };
});
