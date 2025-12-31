import { useState } from 'react';
import { authApi } from '@/features/auth/services/auth.api';
import type { SignUpPayload } from '@/features/auth/types/auth.type';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (payload: SignUpPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authApi.signUp(payload);

      if (res.statusCode !== 201) {
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
