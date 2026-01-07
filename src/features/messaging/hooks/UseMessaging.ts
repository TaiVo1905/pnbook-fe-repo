import { useEffect, useState, useCallback, useRef } from 'react';
import {
  getMessagesByConversationId,
  markAsRead,
} from '../services/messaging.service';
import {
  subscribeToMessages,
  getConversationId,
} from '../../../shared/services/firestore.service';
import type { Message, MessagingResponse } from '../types/messaging.type';

const LIMIT = 50;

const sortByCreatedAtAsc = (list: Message[]) =>
  [...list].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

export const useMessaging = (receiverId: string, currentUserId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const withIsMe = (data: Message[]): Message[] =>
    data.map((msg) => ({
      ...msg,
      isMe: currentUserId
        ? String(msg.senderId) === String(currentUserId)
        : String(msg.senderId) !== String(receiverId),
    }));
  const fetchLatest = useCallback(async () => {
    if (!receiverId) return;
    setIsLoading(true);
    try {
      const res: MessagingResponse<Message[]> =
        await getMessagesByConversationId(receiverId, 1, LIMIT);
      if (res.statusCode !== 200) return;
      if (!res.meta) return;

      const totalPages = res.meta.totalPages ?? 1;

      if (res.data.length === 0) {
        setMessages([]);
        setCurrentPage(1);
        setTotalPages(1);
        return;
      }

      setTotalPages(totalPages);
      setMessages(sortByCreatedAtAsc(withIsMe(res.data)));
      setCurrentPage(1);

      markAsRead(receiverId).catch(() => {});
    } finally {
      setIsLoading(false);
    }
  }, [receiverId]);

  const fetchMore = useCallback(async () => {
    if (!receiverId || isFetchingMore || isLoading) return;

    const nextPage = currentPage + 1;
    if (nextPage > totalPages) return;

    setIsFetchingMore(true);
    try {
      const res: MessagingResponse<Message[]> =
        await getMessagesByConversationId(receiverId, nextPage, LIMIT);
      if (res.statusCode === 200) {
        const olderMessages = withIsMe(res.data);
        setMessages((prev) => sortByCreatedAtAsc([...olderMessages, ...prev]));
        setCurrentPage(nextPage);
      }
    } finally {
      setIsFetchingMore(false);
    }
  }, [receiverId, currentPage, totalPages, isFetchingMore, isLoading]);

  useEffect(() => {
    fetchLatest();

    if (currentUserId && receiverId) {
      const conversationId = getConversationId(currentUserId, receiverId);

      unsubscribeRef.current = subscribeToMessages(
        conversationId,
        (newMessage) => {
          setMessages((prev) => {
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
  }, [fetchLatest, currentUserId, receiverId]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === msg.id);
      if (exists) return prev;
      return sortByCreatedAtAsc([
        ...prev,
        {
          ...msg,
          isMe: currentUserId
            ? String(msg.senderId) === String(currentUserId)
            : true,
        },
      ]);
    });
  };
  return {
    messages,
    isLoading,
    isFetchingMore,
    hasMore: currentPage < totalPages,
    fetchMore,
    addMessage,
  };
};
