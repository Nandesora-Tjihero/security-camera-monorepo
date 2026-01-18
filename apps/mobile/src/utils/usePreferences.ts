import { ApplicationSettings } from "@nativescript/core";

export const usePreferences = () => {
  return {
    getUserId: () => ApplicationSettings.getString("userId"),
    setUserId: (id: string) => ApplicationSettings.setString("userId", id),

    setAppearance: (value: string) =>
      ApplicationSettings.setString("appearance", value),
    getAppearance: () => ApplicationSettings.getString("appearance", "Dark"),

    getImageCache: () => ApplicationSettings.getString("url_cache_v1"),
    setImageCache: (cache: string) =>
      ApplicationSettings.setString("url_cache_v1", cache),

    clearUser: () => ApplicationSettings.remove("userId"),
  };
};
