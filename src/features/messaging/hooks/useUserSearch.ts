import { useEffect, useState } from 'react';
import { searchUsersByName } from '../services/messaging.service';
import type { User } from '../types/messaging.type';
import { toast } from 'sonner';

export const useUserSearch = (keyword: string) => {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const handler = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchUsersByName(keyword.trim());
        if (res?.statusCode === 200 && Array.isArray(res.data)) {
          setResults(res.data);
        } else {
          setResults([]);
        }
      } catch (_err) {
        toast.error('Failed to search users');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(handler);
    };
  }, [keyword]);

  return { results, loading };
};
