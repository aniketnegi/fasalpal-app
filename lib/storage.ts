import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  USER_PHONE: 'user_phone',
  USER_DATA: 'user_data',
  SESSION_TOKEN: 'session_token',
} as const;

export async function setStorageItem(key: string, value: string | null) {
  try {
    if (Platform.OS === 'web') {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } else {
      if (value === null) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    }
  } catch (error) {
    console.error('Storage error:', error);
  }
}

export async function getStorageItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error('Storage error:', error);
    return null;
  }
}

export async function removeStorageItem(key: string) {
  await setStorageItem(key, null);
}

export const StorageKeys = STORAGE_KEYS;
