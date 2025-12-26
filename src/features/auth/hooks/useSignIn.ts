import { useState } from 'react';
import { signIn } from '@/features/auth/services/auth.api';
import type { SignInPayload } from '@/features/auth/types/auth.type';

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (payload: SignInPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await signIn(payload);

      if (res.statusCode !== 200 || !res.data?.accessToken) {
        setError(res.message);
        return false;
      }

      setSuccess(res.message);
      return true;
    } catch {
      setError('Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, success };
}
