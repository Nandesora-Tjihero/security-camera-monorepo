import type { IDatabaseService } from '#shared/core/contracts/database.contract';

export const getDatabaseService = (): IDatabaseService => {
  return useNuxtApp().$firestoreDB as IDatabaseService;
};
