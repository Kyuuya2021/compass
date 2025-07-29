import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  hasCompletedOnboarding: boolean;
  futureVision?: string;
  coreValues?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ローカルストレージのキー
const STORAGE_KEYS = {
  USER: 'compass_user',
  AUTH_TOKEN: 'compass_auth_token'
};

// ローカルストレージユーティリティ
const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化時にローカルストレージからユーザーデータを読み込み
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = storage.get(STORAGE_KEYS.USER);
        if (savedUser) {
          setUser(savedUser);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading user data from localStorage:', error);
        setIsInitialized(true);
      }
    };

    loadUserData();
  }, []);

  // ユーザーデータが変更されたときにローカルストレージに保存
  useEffect(() => {
    if (isInitialized) {
      if (user) {
        storage.set(STORAGE_KEYS.USER, user);
      } else {
        storage.remove(STORAGE_KEYS.USER);
      }
    }
  }, [user, isInitialized]);

  const login = async (email: string, password: string) => {
    // Simulated login - in real app, this would call your API
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      hasCompletedOnboarding: false
    };
    setUser(mockUser);
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulated registration
    const mockUser: User = {
      id: '1',
      email,
      name,
      hasCompletedOnboarding: false
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    // ローカルストレージからも削除
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const clearUserData = () => {
    setUser(null);
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
      clearUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}