import { useEffect, useRef } from 'react';
import { subscribeToNotifications } from '@/shared/services/firestore.service';
import type { Notifications } from '../types/NotificationType';

const sortByCreatedAtDesc = (list: Notifications[]) =>
  [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

interface UseRealtimeNotificationsProps {
  currentUserId: string | undefined;
  onNotificationReceived: (updateFn: (prev: Notifications[]) => Notifications[]) => void;
}

export const useRealtimeNotifications = ({
  currentUserId,
  onNotificationReceived,
}: UseRealtimeNotificationsProps) => {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (currentUserId) {
      unsubscribeRef.current = subscribeToNotifications(
        currentUserId,
        (newNoti) => {
          onNotificationReceived((prev) => {
            const exists = prev.some((n) => n.id === newNoti.id);
            if (exists) return prev;
            return sortByCreatedAtDesc([newNoti, ...prev]);
          });
        },
        (error) => console.error("Firestore Realtime Error:", error)
      );
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUserId, onNotificationReceived]);
};