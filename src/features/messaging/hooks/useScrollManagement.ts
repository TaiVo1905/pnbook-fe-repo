import { useRef, useEffect } from 'react';

interface UseScrollManagementProps {
  messages: unknown[];
  isLoading: boolean;
  isFetchingMore: boolean;
}

export const useScrollManagement = ({
  messages,
  isLoading,
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

  useEffect(() => {
    if (!isLoading && isInitialLoadRef.current) {
      setTimeout(scrollToBottom, 100);
      isInitialLoadRef.current = false;
    }
  }, [isLoading, messages]);

  return {
    scrollRef,
    scrollToBottom,
    isNearBottom,
  };
};
