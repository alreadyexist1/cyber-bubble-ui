
import { useContext, useState, useEffect, createContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { username?: string; avatar_url?: string; bio?: string }) => Promise<void>;
  updateStatus: (status: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Update user status to online when signed in
          if (session?.user) {
            updateStatus('online').catch(console.error);
          }
        } else if (event === 'SIGNED_OUT') {
          // Navigate to login page when signed out
          navigate('/login');
        }
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Update user status to online if session exists
      if (session?.user) {
        updateStatus('online').catch(console.error);
      }
    });
    
    // Setup beforeunload event to update status to offline when tab/browser closes
    const handleBeforeUnload = () => {
      if (session?.user) {
        // Use a direct API call instead of accessing protected properties
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL || 'https://vfdjzxpxnjvcamhbpiwu.supabase.co'}/rest/v1/profiles?id=eq.${session.user.id}`;
        const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZGp6eHB4bmp2Y2FtaGJwaXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MjY2MjksImV4cCI6MjA1ODMwMjYyOX0.0TwZbJBBHe5t8zwa5Dok37t0VHpssEty6NPJOiNkF7c';
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', apiUrl, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('apikey', apiKey);
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
        xhr.send(JSON.stringify({ status: 'offline', last_online: new Date().toISOString() }));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);
  
  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) throw error;
      toast({
        title: "Success!",
        description: "Registration successful. Please check your email for verification.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in",
      });
      navigate('/chat');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      // Update status to offline before signing out
      if (user) {
        await updateStatus('offline');
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You've been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };
  
  const updateProfile = async (data: { username?: string; avatar_url?: string; bio?: string }) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const updateStatus = async (status: string) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status, 
          last_online: status === 'offline' ? new Date().toISOString() : undefined 
        })
        .eq('id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        updateStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
