import type { IDatabaseService } from '~/core/contracts/database.contract';

export const getDatabaseService = (): IDatabaseService => {
  return useNuxtApp().$firestoreDB as IDatabaseService;
};
