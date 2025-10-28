import { IDatabaseService } from '~/core/contracts/database.contract';
import { getFirestoreClient } from './02.firestoreClient.server';

export const getDatabaseService = (): IDatabaseService => {
  return getFirestoreClient();
};
