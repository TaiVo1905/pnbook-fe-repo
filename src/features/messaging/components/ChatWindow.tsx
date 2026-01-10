import { useRef, useLayoutEffect } from 'react';
import { useScrollManagement } from '../hooks/useScrollManagement';
import { useMessageActions } from '../hooks/useMessageActions';
import { useMessageList } from '../hooks/useMessageList';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { Message } from '../types/messaging.type';
const ChatWindow = ({
  chatId,
  userName,
  userAvatarUrl,
  currentUserId,
  onMessageSent,
}: {
  chatId: string;
  userName?: string;
  userAvatarUrl?: string;
  currentUserId?: string;
  onMessageSent?: (msg: Message) => void;
}) => {
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const {
    messages,
    setMessages,
    isLoading,
    isFetchingMore,
    hasMore,
    fetchMore: fetchMoreMessages,
    addMessage,
  } = useMessageList({ receiverId: chatId, currentUserId });

  const { scrollRef, scrollToBottom } = useScrollManagement({
    messages,
    isLoading,
    isFetchingMore,
  });

  useRealtimeMessages({
    receiverId: chatId,
    currentUserId,
    onMessageReceived: setMessages,
  });

  const { input, setInput, isUploading, handleSendText, handleImageChange } =
    useMessageActions({
      chatId,
      onMessageSent: (msg) => {
        addMessage(msg);
        onMessageSent?.(msg);
        scrollToBottom();
      },
      onScrollToBottom: scrollToBottom,
    });

  const handleImageLoadedDuringPagination = () => {
    if (isLoadingMoreRef.current && scrollRef.current) {
      const currentScrollHeight = scrollRef.current.scrollHeight;
      const originalScrollHeight = prevScrollHeightRef.current;
      const originalScrollTop = prevScrollTopRef.current;

      scrollRef.current.scrollTop =
        originalScrollTop + (currentScrollHeight - originalScrollHeight);
    } else {
      scrollToBottom();
    }
  };

  useLayoutEffect(() => {
    if (isLoadingMoreRef.current && scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const newScrollHeight = scrollRef.current.scrollHeight;
          const prevScrollHeight = prevScrollHeightRef.current;
          const prevScrollTop = prevScrollTopRef.current;
          scrollRef.current.scrollTop =
            prevScrollTop + (newScrollHeight - prevScrollHeight);
        }
      });
    }
  }, [messages]);

  useLayoutEffect(() => {
    if (isLoadingMoreRef.current && !isFetchingMore) {
      const timeout = setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isFetchingMore]);

  const handleScroll = async () => {
    if (!scrollRef.current) return;
    if (!hasMore || isFetchingMore || isLoading) return;
    if (scrollRef.current.scrollTop === 0) {
      prevScrollHeightRef.current = scrollRef.current.scrollHeight;
      prevScrollTopRef.current = scrollRef.current.scrollTop;
      isLoadingMoreRef.current = true;
      await fetchMoreMessages();
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white shadow-sm">
      <ChatHeader
        userName={userName}
        userAvatarUrl={userAvatarUrl}
        chatId={chatId}
      />
      <MessageList
        scrollRef={scrollRef}
        messages={messages}
        isLoading={isLoading}
        isFetchingMore={isFetchingMore}
        userName={userName}
        userAvatarUrl={userAvatarUrl}
        chatId={chatId}
        onScroll={handleScroll}
        onImageLoaded={handleImageLoadedDuringPagination}
      />
      <ChatInput
        input={input}
        isUploading={isUploading}
        onInputChange={setInput}
        onSendText={handleSendText}
        onImageChange={handleImageChange}
      />
    </div>
  );
};

export default ChatWindow;
