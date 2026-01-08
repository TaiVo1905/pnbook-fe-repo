import { useCallback, useEffect, useState } from 'react';
import {
  getNotification,
  readNotification,
} from '../services/NotificationService';
import type { Notifications } from '../types/NotificationType';
import { toast } from 'sonner';

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotification();
      if (response && response.statusCode === 200) {
        setNotifications(Array.isArray(response.data) ? response.data : []);
      }
    } catch (_error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      try {
        await readNotification(id);
      } catch (_error) {
        fetchNotifications();
      }
    },
    [fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    if (notifications.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      toast.success('All notifications have been marked as read');
    } catch (_error) {
      fetchNotifications();
    }
  }, [notifications.length, fetchNotifications]);

  return {
    notifications,
    setNotifications,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
};
