import { after, beforeEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';
import Dashboard from '~/pages/dashboard.vue';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

const A_DAY_IN_THE_FUTURE = Math.floor(
  (Date.now() + 24 * 60 * 60 * 1000) / 1000
);
const A_DAY_IN_THE_PAST = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);

// mockNuxtImport('useUser', () => {
//   return () => {
//     return {
//       user: {
//         value: { id: 'user_123', email: 'user@example.com' },
//       },
//       setSubscription: vi.fn((subscription: any) => {
//         console.log('Setting subscription:', subscription);
//       }),
//       subscription: {
//         value: {
//           status: 'trialing',
//           /*1760372818*/
//           current_period_end: A_DAY_IN_THE_PAST,
//         },
//       },
//     };
//   };
// });

// const currentPeriodEndDateIsPast = (subscription: any) => {
//   if (!subscription?.current_period_end) {
//     return false;
//   }
//   const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
//   const now = new Date();
//   return currentPeriodEnd < now;
// };
// mockNuxtImport('useSubscription', () => {
//   return () => {
//     const user = useUser(); // <-- Move here!

//     return {
//       hasActiveSubscription:
//         user.subscription.value?.status === 'active' ||
//         (user.subscription.value?.status === 'trialing' &&
//           !currentPeriodEndDateIsPast(user.subscription.value)),
//     };
//   };
// });
describe('User subscription tests', async () => {
  let dashboardWrapper: ReturnType<typeof mountSuspended> =
    await mountSuspended(Dashboard);

  beforeEach(() => {
    vi.useFakeTimers();
  });

  after(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it('shows Upgrade button when subscription status is an expired trial', async () => {
    let dashboardWrapper: ReturnType<typeof mountSuspended> =
      await mountSuspended(Dashboard);
    const { setSubscription } = useUser();
    const { hasActiveSubscription } = useSubscription();

    setSubscription({
      id: 'sub_123',
      status: 'trialing',
      current_period_end: A_DAY_IN_THE_PAST,
      price_id: 'price_123',
    });

    await nextTick();
    expect(hasActiveSubscription.value).toBe(false);

    const upgradeButton = dashboardWrapper.find('[data-test="upgrade-button"]');
    console.log('Upgrade Button:', dashboardWrapper.html());
    expect(upgradeButton.exists()).toBe(true);
  });
  it.todo(
    'prevents user from using the monitoring feature when subscription is inactive',
    async () => {}
  );
});
