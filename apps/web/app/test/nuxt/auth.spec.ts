import { afterEach, beforeEach, describe, expect, it, vi, test } from 'vitest';
import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import auth from '#layers/auth/app/pages/auth.vue';
import type { IDatabaseService } from '#shared/core/contracts/database.contract';
import type { IAuthService, IBillingService } from '#shared/core/contracts';

interface IServices {
  getAuthService: () => IAuthService;
  getDatabaseService: () => IDatabaseService;
  getBillingService: () => IBillingService;
}

const { user, setUser } = useUser();

describe('Auth Component', () => {
  let wrapper: ReturnType<typeof mount>;

  const setupWrapper = () => {
    wrapper = mount(auth);
  };

  beforeEach(() => {
    setupWrapper();
  });

  afterEach(() => {
    vi.resetAllMocks();
    setUser(null);
  });

  it('shows the sign in button', () => {
    const button = wrapper.find('[data-testid="google-signin-btn"]');
    expect(button.exists()).toBe(true);
  });

  it('calls auth and database on sign in', async () => {
    const button = wrapper.find('[data-testid="google-signin-btn"]');

    await button.trigger('click');

    const services = (await import(
      '#layers/01-base/app/utils/services'
    )) as IServices;
    const authService = services.getAuthService();
    const db = services.getDatabaseService();

    // Wait for async handlers inside the component to run
    await new Promise((r) => setImmediate(r));

    expect(authService.signInWithGoogle).toHaveBeenCalled();
    expect(db.getUserById).toHaveBeenCalledWith('12345');
  });

  it('creates user when not found', async () => {
    const services = (await import(
      '#layers/01-base/app/utils/services'
    )) as IServices;
    const db = services.getDatabaseService();

    (db.getUserById as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        uid: '12345',
        email: 'testuser@gmail.com',
        displayName: 'Test User',
        getIdToken: vi.fn(async () => 'mock-id-token'),
      });

    const button = wrapper.find('[data-testid="google-signin-btn"]');
    await button.trigger('click');

    // Wait for signInWithGoogle and its nested async calls
    await flushPromises();
    await flushPromises(); // run twice to catch nested awaits/reactivity

    expect(db.createUser).toHaveBeenCalledWith({
      uid: '12345',
      email: 'testuser@gmail.com',
      displayName: 'Test User',
    });

    await flushPromises();
    await flushPromises(); // run twice to catch nested awaits/reactivity
    expect(user.value).toMatchObject({ uid: '12345' });
  });
});
