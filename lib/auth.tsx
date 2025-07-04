import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem, StorageKeys } from './storage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (phone: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: {
    name: string;
    email: string;
    phone: string;
    pin: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getStoredPhoneNumber: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

const DUMMY_USER = [
  {
    id: '0',
    name: 'Aniket Negi',
    email: 'email@aniketnegi.com',
    phone: '+917011270902',
    pin: '69420',
  },
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await getStorageItem(StorageKeys.USER_DATA);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (
    phone: string,
    pin: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Signing in with phone:', phone, 'and pin:', pin);
      const foundUser = DUMMY_USER.find((u) => u.phone === phone && u.pin === pin);
      console.log('Found user:', foundUser);

      if (!foundUser) {
        return { success: false, error: 'Invalid phone number or PIN' };
      }

      // Store user data
      const userToStore = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
      };

      console.log('Storing user data:', userToStore);

      await setStorageItem(StorageKeys.USER_DATA, JSON.stringify(userToStore));
      await setStorageItem(StorageKeys.USER_PHONE, phone);
      await setStorageItem(StorageKeys.SESSION_TOKEN, `token_${foundUser.id}`);

      setUser(userToStore);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    phone: string;
    pin: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const existingUser = DUMMY_USER.find(
        (u) => u.phone === userData.phone || u.email === userData.email
      );
      if (existingUser) {
        return { success: false, error: 'User already exists with this phone number or email' };
      }

      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      };

      DUMMY_USER.push({ ...newUser, pin: userData.pin });

      // Store user data
      await setStorageItem(StorageKeys.USER_DATA, JSON.stringify(newUser));
      await setStorageItem(StorageKeys.USER_PHONE, userData.phone);
      await setStorageItem(StorageKeys.SESSION_TOKEN, `token_${newUser.id}`);

      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const signOut = async () => {
    try {
      await removeStorageItem(StorageKeys.USER_DATA);
      await removeStorageItem(StorageKeys.SESSION_TOKEN);
      // Keep phone number stored for auto-fill
      setUser(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const getStoredPhoneNumber = async (): Promise<string | null> => {
    return await getStorageItem(StorageKeys.USER_PHONE);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        getStoredPhoneNumber,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
