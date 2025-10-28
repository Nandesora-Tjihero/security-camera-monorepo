import type { AppEvents } from '~/core/models/detection.model';

const bus = ref(new Map<keyof AppEvents, AppEvents[keyof AppEvents]>());

export const useEventsBus = () => {
  const emit = <K extends keyof AppEvents>(event: K, payload: AppEvents[K]) => {
    if (event === 'detected' && !validateDetectedPerson(payload)) {
      throw new Error('Invalid payload for detected event');
    }
    bus.value.set(event, payload);
  };

  return {
    emit,
    bus,
  };
};

const validateDetectedPerson = (
  payload: unknown
): payload is AppEvents['detected'] => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    Array.isArray((payload as AppEvents['detected']).bbox) &&
    (payload as AppEvents['detected']).bbox.length === 4 &&
    typeof (payload as AppEvents['detected']).class === 'string' &&
    typeof (payload as AppEvents['detected']).score === 'number'
  );
};
