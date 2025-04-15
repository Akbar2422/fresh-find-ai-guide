
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          setState({ user: null, loading: false, error: error.message });
          navigate('/auth');
          return;
        }
        
        if (data?.user) {
          setState({ user: data.user, loading: false, error: null });
        } else {
          setState({ user: null, loading: false, error: null });
          navigate('/auth');
        }
      } catch (error: any) {
        console.error('Unexpected error in auth check:', error);
        setState({ 
          user: null, 
          loading: false, 
          error: error?.message || 'Authentication error' 
        });
        navigate('/auth');
      }
    };

    getUser();

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setState({ user: null, loading: false, error: null });
          navigate('/auth');
        } else if (session?.user) {
          setState({ user: session.user, loading: false, error: null });
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      console.error('Error during logout:', error);
      setState(prev => ({ 
        ...prev, 
        error: error?.message || 'Logout failed' 
      }));
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    logout: handleLogout
  };
};
