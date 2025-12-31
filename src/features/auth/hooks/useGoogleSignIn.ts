import { useState } from 'react';
import { authApi } from '@/features/auth/services/auth.api';
import type { GoogleSignInPayload } from '@/features/auth/types/auth.type';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (payload: GoogleSignInPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authApi.googleSignIn(payload);

      if (res.statusCode !== 200) {
        setError(res.message);
        return false;
      }

      setSuccess(res.message);
      navigate('/app/home');

      return true;
    } catch {
      setError('Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const useGoogleLoginHook = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (tokenResponse) => {
      try {
        const { code } = tokenResponse;
        const isSuccess = await submit({ authCode: code });
        return isSuccess;
      } catch {
        setError('Google sign-in failed');
        return false;
      }
    },
    onError: () => {
      setError('Google sign-in was unsuccessful. Please try again.');
    },
  });

  return { submit: useGoogleLoginHook, loading, error, success };
}
