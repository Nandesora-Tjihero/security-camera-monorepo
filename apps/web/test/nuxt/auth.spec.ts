import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

import auth from '~/pages/auth.vue';
import type { IDatabaseService } from '~/core/contracts/database.contract';
import type { IAuthService, IBillingService } from '~/core/contracts';

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

    const services = (await import('~/utils/services')) as IServices;
    const authService = services.getAuthService();
    const db = services.getDatabaseService();

    // Wait for async handlers inside the component to run
    await new Promise((r) => setImmediate(r));

    expect(authService.signInWithGoogle).toHaveBeenCalled();
    expect(db.getUserById).toHaveBeenCalledWith('12345');
  });

  it('creates user when not found', async () => {
    const services = (await import('~/utils/services')) as IServices;
    const db = services.getDatabaseService();
    // Simulate user not found on first call, then present after create
    (db.getUserById as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        uid: '12345',
        email: 'testuser@gmail.com',
        displayName: 'Test User',
      });

    const button = wrapper.find('[data-testid="google-signin-btn"]');
    await button.trigger('click');
    await flushPromises();
    expect(db.createUser).toHaveBeenCalledWith({
      uid: '12345',
      email: 'testuser@gmail.com',
      displayName: 'Test User',
    });
    expect(user.value).toMatchObject({ uid: '12345' });
  });

  it.todo('fetches and sets subscription if user has one', async () => {});
});
