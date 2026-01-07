import { useEffect, useRef } from 'react';
import {
  subscribeToMessages,
  getConversationId,
} from '@/shared/services/firestore.service';
import type { Message } from '../types/messaging.type';

const sortByCreatedAtAsc = (list: Message[]) =>
  [...list].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

interface UseRealtimeMessagesProps {
  receiverId: string;
  currentUserId?: string;
  onMessageReceived: (updateFn: (prev: Message[]) => Message[]) => void;
}

export const useRealtimeMessages = ({
  receiverId,
  currentUserId,
  onMessageReceived,
}: UseRealtimeMessagesProps) => {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (currentUserId && receiverId) {
      const conversationId = getConversationId(currentUserId, receiverId);

      unsubscribeRef.current = subscribeToMessages(
        conversationId,
        (newMessage) => {
          onMessageReceived((prev) => {
            const exists = prev.some(
              (m) =>
                m.id === newMessage.id ||
                (m.createdAt === newMessage.createdAt &&
                  m.senderId === newMessage.senderId &&
                  m.content === newMessage.content)
            );
            if (exists) return prev;

            const messageWithFlag = {
              ...newMessage,
              isMe: currentUserId
                ? String(newMessage.senderId) === String(currentUserId)
                : String(newMessage.senderId) !== String(receiverId),
            };

            return sortByCreatedAtAsc([...prev, messageWithFlag]);
          });
        },
        (_error) => {}
      );
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUserId, receiverId, onMessageReceived]);
};
