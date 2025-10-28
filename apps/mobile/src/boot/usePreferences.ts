import { ApplicationSettings } from '@nativescript/core';

export const usePreferences = () => {
  return {
    getUserId: () => ApplicationSettings.getString('userId'),
    getAppearance: () => ApplicationSettings.getString('appearance', 'Light'),

    setUserId: (id: string) => ApplicationSettings.setString('userId', id),
    clearUser: () => ApplicationSettings.remove('userId'),
  };
};
