import { useEffect, useState, useCallback } from 'react';
import { getMessagesByConversationId } from '../services/messaging.service';
import type { Message, MessagingResponse } from '../types/messaging.type';

const LIMIT = 50;

export const useMessaging = (receiverId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const withIsMe = (data: Message[]): Message[] =>
    data.map((msg) => ({
      ...msg,
      isMe: String(msg.senderId) !== String(receiverId),
    }));
  const fetchLatest = useCallback(async () => {
    if (!receiverId) return;
    setIsLoading(true);
    try {
      const firstRes: MessagingResponse<Message[]> =
        await getMessagesByConversationId(receiverId, 1, LIMIT);
      if (firstRes.statusCode !== 200) return;
      if (!firstRes.meta) return;
      const totalItems = firstRes.meta.totalItems ?? 0;
      if (totalItems === 0) {
        setMessages([]);
        setCurrentPage(1);
        setHasMore(false);
        return;
      }
      const lastPage = Math.ceil(totalItems / LIMIT);
      const lastRes: MessagingResponse<Message[]> =
        await getMessagesByConversationId(receiverId, lastPage, LIMIT);
      if (lastRes.statusCode === 200) {
        setMessages(withIsMe(lastRes.data));
        setCurrentPage(lastPage);
        setHasMore(lastPage > 1);
      }
    } finally {
      setIsLoading(false);
    }
  }, [receiverId]);

  const fetchMore = useCallback(async () => {
    if (
      !receiverId ||
      !hasMore ||
      isFetchingMore ||
      isLoading ||
      currentPage === null ||
      currentPage <= 1
    ) {
      return;
    }
    setIsFetchingMore(true);
    const prevPage = currentPage - 1;
    try {
      const res: MessagingResponse<Message[]> =
        await getMessagesByConversationId(receiverId, prevPage, LIMIT);
      if (res.statusCode === 200) {
        const olderMessages = withIsMe(res.data);
        setMessages((prev) => [...olderMessages, ...prev]);
        setCurrentPage(prevPage);
        setHasMore(prevPage > 1);
      }
    } finally {
      setIsFetchingMore(false);
    }
  }, [receiverId, currentPage, hasMore, isFetchingMore, isLoading]);
  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);
  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, { ...msg, isMe: true }]);
  };
  return {
    messages,
    isLoading,
    isFetchingMore,
    hasMore,
    fetchMore,
    addMessage,
  };
};
