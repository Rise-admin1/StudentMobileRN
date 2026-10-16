import { Platform } from 'react-native';

const ANDROID_APP_SUFFIX = /\s*\(Coach Academ\)\s*$/i;

export function storeProductTitle(title: string | null | undefined, fallback: string) {
  const raw = (title || '').trim();
  if (!raw) return fallback;
  if (Platform.OS !== 'android') return raw;
  return raw.replace(ANDROID_APP_SUFFIX, '').trim() || fallback;
}
