import { supabase } from './supabase';
import { Alert } from 'react-native';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'judge' | 'admin';
  is_online?: boolean;
}

export class AuthService {
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || undefined,
        avatar_url: profile.avatar_url || undefined,
        role: profile.role,
        is_online: profile.is_online || false,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async updateOnlineStatus(isOnline: boolean) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_online: isOnline,
          last_seen: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Update online status error:', error);
    }
  }

  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
        
        // Update online status when user signs in
        if (event === 'SIGNED_IN') {
          await this.updateOnlineStatus(true);
        }
      } else {
        callback(null);
      }
    });
  }
}