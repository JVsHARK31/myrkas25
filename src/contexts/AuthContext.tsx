import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthUser extends User {
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Demo user credentials
const DEMO_CREDENTIALS = {
  email: 'admin@rkas.com',
  password: '123456',
  user: {
    id: 'demo-user-id',
    email: 'admin@rkas.com',
    name: 'Administrator R-KAS',
    role: 'Administrator',
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
      name: 'Administrator R-KAS',
      role: 'Administrator'
    }
  } as AuthUser
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('rkas_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('rkas_user');
      }
    }
    setLoading(false);

    // Try to get Supabase session as fallback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !user) {
        const authUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email,
          role: session.user.user_metadata?.role || 'User'
        } as AuthUser;
        setUser(authUser);
        localStorage.setItem('rkas_user', JSON.stringify(authUser));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const authUser = {
          ...session.user,
          name: session.user.user_metadata?.name || session.user.email,
          role: session.user.user_metadata?.role || 'User'
        } as AuthUser;
        setUser(authUser);
        localStorage.setItem('rkas_user', JSON.stringify(authUser));
      } else if (!localStorage.getItem('rkas_user')) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Check demo credentials first
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setUser(DEMO_CREDENTIALS.user);
      localStorage.setItem('rkas_user', JSON.stringify(DEMO_CREDENTIALS.user));
      return;
    }

    // Try Supabase authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const authUser = {
        ...data.user,
        name: data.user.user_metadata?.name || data.user.email,
        role: data.user.user_metadata?.role || 'User'
      } as AuthUser;

      setUser(authUser);
      localStorage.setItem('rkas_user', JSON.stringify(authUser));
    } catch (error: any) {
      throw new Error(error.message || 'Login gagal');
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('rkas_user');
    await supabase.auth.signOut();
  };

  const signIn = async (email: string, password: string) => {
    try {
      await login(email, password);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    await logout();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}