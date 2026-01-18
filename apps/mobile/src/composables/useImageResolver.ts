import { firebase } from "@nativescript/firebase-core";
import "@nativescript/firebase-storage";
import { usePreferences } from "~/utils/usePreferences";

const storage = firebase().storage();
const preferences = usePreferences();

let urlCache: Map<string, string>;
try {
  const savedCache = preferences.getImageCache();
  if (savedCache) {
    urlCache = new Map(JSON.parse(savedCache));
  } else {
    urlCache = new Map();
  }
} catch (e) {
  console.error("Failed to load url cache", e);
  urlCache = new Map();
}

const saveCache = () => {
  try {
    // Convert Map to array of entries for JSON serialization
    const entries = Array.from(urlCache.entries());
    preferences.setImageCache(JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save url cache", e);
  }
};

export const resolveCachedImage = async (
  storagePath: string
): Promise<string | undefined> => {
  if (urlCache.has(storagePath)) {
    return urlCache.get(storagePath);
  }

  try {
    const fileRef = storage.ref(storagePath);
    const url = await fileRef.getDownloadURL();

    if (url) {
      urlCache.set(storagePath, url);
      saveCache();
    }
    return url;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    return undefined;
  }
};

export const useImageResolver = () => {
  return {
    resolveCachedImage,
  };
};
