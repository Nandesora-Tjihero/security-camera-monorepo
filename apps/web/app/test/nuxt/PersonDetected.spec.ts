import { PersonDetected } from '#components';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('PersonDetected.vue', () => {
  const NO_DEVICE_REGISTERED_MESSAGE =
    'Please add a notification device from the mobile app to enable monitoring.';

  it('if user has not registered a notification device, detection should not start and a message instructing them to register should be shown', async () => {
    const { setUser, hasNotificationDevice } = useUser();
    const personDetectedWrapper = mount(PersonDetected);

    setUser({
      uid: 'user123',
      email: 'user123@example.com',
      displayName: 'User 123',
      tokens: [], // No notification device registered
    });

    console.log('hasNotificationDevice value:', hasNotificationDevice.value);

    expect(hasNotificationDevice.value).toBe(false);

    const deviceRegistrationMessage = personDetectedWrapper.find(
      '[data-test="no-device-registered"]'
    );
    expect(deviceRegistrationMessage.exists()).toBe(true);
    expect(deviceRegistrationMessage.text()).toBe(NO_DEVICE_REGISTERED_MESSAGE);
  });
});
