import { ref, Ref } from 'nativescript-vue';
import { firebase } from '@nativescript/firebase-core';
import type { IDetection } from '~/core/models';
import { firebaseUtils } from '~/utils/firebaseHelpers';

export function useDetections(userId: string) {
  const detections = ref<IDetection[]>([]);
  firebaseUtils.handleDetectionsChange(userId, (data) => {
    console.log('ddd', data);
    detections.value.push(data);
  });
  return detections;
}
