import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { IBillingService } from '~/core/contracts';

import { getBillingService } from '~/utils/services';
import { getDatabaseService } from '~/utils/services';
import { getStorageService } from '~/utils/services';

const mockGetSubscriptionStatus = vi.fn(async (userId: string) => {
  return 'free';
});
const mockCreateCheckoutSession = vi.fn(
  async (userId: string, priceId: string) => {
    return { url: 'https://checkout.session.url' };
  }
);
const mockCancelSubscription = vi.fn(async (userId: string) => {});

vi.mock('~/utils/services/getBillingService', () => ({
  getBillingService: vi.fn(() => ({
    getSubscriptionStatus: mockGetSubscriptionStatus,
    createCheckoutSession: mockCreateCheckoutSession,
    cancelSubscription: mockCancelSubscription,
  })),
}));

const mockGetUser = vi.fn(async (uid: string) => ({
  uid,
  email: 'user@example.com',
}));

vi.mock('~/utils/services/getDatabaseService.client', () => ({
  getDatabaseService: vi.fn(() => ({
    getUser: mockGetUser,
  })),
}));

const mockUploadImage = vi.fn(async (userId: string, blob: Blob) => {
  return `https://storage.service/${userId}/image.jpg`;
});

describe.todo('BillingService', () => {});
