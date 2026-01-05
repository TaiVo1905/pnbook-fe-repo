import { useRef, useEffect } from 'react';

interface UseScrollManagementProps {
  messages: unknown[];
  isLoading: boolean;
  isFetchingMore: boolean;
}

export const useScrollManagement = ({
  messages,
  isLoading,
  isFetchingMore,
}: UseScrollManagementProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const isNearBottom = () => {
    if (!scrollRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollHeight - (scrollTop + clientHeight) < 120;
  };

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!isLoading && isInitialLoadRef.current) {
      setTimeout(scrollToBottom, 100);
      isInitialLoadRef.current = false;
    }
  }, [isLoading]);

  // Auto-scroll when new messages arrive and user is near bottom
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    if (isFetchingMore || isLoading) return;
    if (isNearBottom()) {
      setTimeout(scrollToBottom, 50);
    }
  }, [messages, isFetchingMore, isLoading]);

  return {
    scrollRef,
    scrollToBottom,
    isNearBottom,
  };
};
