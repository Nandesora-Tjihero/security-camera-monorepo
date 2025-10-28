import type { Subscription } from '~/core/contracts/billing.contract';
import type { DetectionRecord } from '~/core/models/detection.model';

export default defineNuxtPlugin((nuxtApp) => {
  async function createUser(user: {
    uid: string;
    email: string;
    displayName: string;
  }): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  async function getUser(
    uid: string
  ): Promise<{ uid: string; email: string; displayName: string } | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uid: 'stub-uid',
          email: 'stub-email@example.com',
          displayName: 'Stub User',
        });
      }, 500);
    });
  }

  async function saveCustomerId(
    userId: string,
    customerId: string
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  async function saveUserSubscription(
    userId: string,
    subscription: Subscription
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  async function getSubscription(userId: string): Promise<Subscription | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'stub-subscription-id',
          price_id: 'stub-price-id',
          current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000,
          status: 'active',
        });
      }, 500);
    });
  }

  async function saveDetectionForUser(
    userId: string,
    detection: DetectionRecord
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  async function getDetectionsByUser(
    userId: string,
    startTime?: number,
    endTime?: number,
    offset?: number,
    limit?: number
  ): Promise<DetectionRecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            timestamp: Date.now(),
            imageUrl: 'https://example.com/stub-image.jpg',
          },
        ]);
      }, 500);
    });
  }

  return {
    provide: {
      stubDatabase: {
        createUser,
        getUser,
        saveCustomerId,
        saveUserSubscription,
        getSubscription,
        saveDetectionForUser,
        getDetectionsByUser,
      },
    },
  };
});
