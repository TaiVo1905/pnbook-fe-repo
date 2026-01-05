import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/services/auth.api';

export function useSignOut() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signOut = async () => {
    setLoading(true);

    try {
      const res = await authApi.signOut();

      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });

      if (res.message) {
        toast.success(res.message);
      }

      navigate('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading };
}
