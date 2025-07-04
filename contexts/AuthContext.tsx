import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    AuthService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update online status when app becomes active/inactive
  useEffect(() => {
    if (user) {
      AuthService.updateOnlineStatus(true);

      return () => {
        AuthService.updateOnlineStatus(false);
      };
    }
  }, [user]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await AuthService.signInWithGoogle();
      if (error) {
        console.error('Sign in error:', error);
        // Handle error (show toast, etc.)
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AuthService.updateOnlineStatus(false);
      const { error } = await AuthService.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const user = await AuthService.getCurrentUser();
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      signOut,
      refreshUser,
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