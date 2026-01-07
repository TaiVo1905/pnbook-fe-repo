import { useScrollManagement } from '../hooks/useScrollManagement';
import { useMessageActions } from '../hooks/useMessageActions';
import { useMessageList } from '../hooks/useMessageList';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
const ChatWindow = ({
  chatId,
  userName,
  userAvatarUrl,
  currentUserId,
}: {
  chatId: string;
  userName?: string;
  userAvatarUrl?: string;
  currentUserId?: string;
}) => {
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
        scrollToBottom();
      },
      onScrollToBottom: scrollToBottom,
    });

  const handleScroll = async () => {
    if (!scrollRef.current) return;
    if (!hasMore || isFetchingMore || isLoading) return;
    if (scrollRef.current.scrollTop === 0) {
      const prevHeight = scrollRef.current.scrollHeight;
      await fetchMoreMessages();
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const newHeight = scrollRef.current.scrollHeight;
          scrollRef.current.scrollTop = newHeight - prevHeight;
        }
      });
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
        onImageLoaded={scrollToBottom}
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
