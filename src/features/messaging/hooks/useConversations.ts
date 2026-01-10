import { useState, useEffect, useCallback } from 'react';
import { getConversationList } from '../services/messaging.service';
import type { Conversation, Message, User } from '../types/messaging.type';
import { toast } from 'sonner';

interface UpsertConversationPayload {
  user: User;
  message: Message;
  isMe?: boolean;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversationList();

        if (response && response.statusCode === 200) {
          setConversations(Array.isArray(response.data) ? response.data : []);
        }
      } catch (_error) {
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const markAsRead = useCallback((userId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.user?.id === userId
          ? {
              ...c,
              unreadCount: 0,
              lastMessage: c.lastMessage
                ? { ...c.lastMessage, status: 'read' }
                : c.lastMessage,
            }
          : c
      )
    );
  }, []);

  const upsertConversation = useCallback(
    ({ user, message, isMe = true }: UpsertConversationPayload) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.user?.id === user.id);
        const lastMessageAt = message.createdAt || new Date().toISOString();

        const baseUnread = existing?.unreadCount ?? 0;
        const unreadCount = isMe ? 0 : baseUnread + 1;

        const updated: Conversation = {
          id: existing?.id || user.id,
          user,
          lastMessage: message,
          content: message.content,
          unreadCount,
          lastMessageAt,
          timeAgo: existing?.timeAgo || 'Just now',
        };

        const without = prev.filter((c) => c.user?.id !== user.id);
        return [updated, ...without];
      });
    },
    []
  );

  return { conversations, loading, markAsRead, upsertConversation };
};
