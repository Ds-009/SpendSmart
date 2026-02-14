import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface AuthUser {
  email: string;
}

interface AuthContextValue {
  session: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AUTH_USER_KEY = 'spendsmart_auth_user';
const AUTH_USERS_KEY = 'spendsmart_auth_users';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readUsers = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
};

const readSession = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthUser | null>(readSession);

  const login = async (email: string, password: string) => {
    const users = readUsers();
    if (!users[email] || users[email] !== password) {
      throw new Error('Invalid email or password');
    }

    const nextSession = { email };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const signup = async (email: string, password: string) => {
    const users = readUsers();
    if (users[email]) {
      throw new Error('Account already exists for this email');
    }

    users[email] = password;
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  };

  const logout = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    setSession(null);
  };

  const value = useMemo(
    () => ({ session, loading: false, login, signup, logout }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
