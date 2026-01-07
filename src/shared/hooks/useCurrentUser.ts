import { useState, useEffect } from 'react';
import { userApi } from '@/core/api/user.api';
import { toast } from 'sonner';

export const useCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        if (response?.data) {
          setCurrentUserId(response.data.id);
        }
      } catch (_error) {
        toast.error('Failed to fetch current user');
      }
    };
    fetchCurrentUser();
  }, []);

  return { currentUserId };
};
