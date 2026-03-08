import type { ScUser } from "#shared/core/models";

export const useUserState = () => {
  return {
    user: useState<ScUser | null>("user", () => null),
    hasNotificationDevice: useState<boolean>(
      "hasNotificationDevice",
      () => false,
    ),
  };
};
