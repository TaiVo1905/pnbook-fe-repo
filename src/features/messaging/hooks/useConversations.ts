import { useState, useEffect, useCallback } from 'react';
import { getConversationList } from '../services/messaging.service';
import type { Conversation } from '../types/messaging.type';
import { toast } from 'sonner';

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

  return { conversations, loading, markAsRead };
};
