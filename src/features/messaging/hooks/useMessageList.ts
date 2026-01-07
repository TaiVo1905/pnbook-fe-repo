import { useEffect, useState, useCallback } from 'react';
import {
  getMessagesByConversationId,
  markAsRead,
} from '../services/messaging.service';
import type { Message, MessagingResponse } from '../types/messaging.type';

const LIMIT = 50;

const sortByCreatedAtAsc = (list: Message[]) =>
  [...list].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

interface UseMessageListProps {
  receiverId: string;
  currentUserId?: string;
}

export const useMessageList = ({
  receiverId,
  currentUserId,
}: UseMessageListProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

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
  }, [receiverId, currentUserId]);

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
  }, [
    receiverId,
    currentPage,
    totalPages,
    isFetchingMore,
    isLoading,
    currentUserId,
  ]);

  const addMessage = useCallback(
    (msg: Message) => {
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
    },
    [currentUserId]
  );

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  return {
    messages,
    setMessages,
    isLoading,
    isFetchingMore,
    hasMore: currentPage < totalPages,
    fetchMore,
    addMessage,
  };
};
