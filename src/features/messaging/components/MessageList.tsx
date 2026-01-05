import React from 'react';
import { Loader2 } from 'lucide-react';
import { MessageItem } from './MessageItem';
import type { Message } from '../types/messaging.type';

interface MessageListProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  messages: Message[];
  isLoading: boolean;
  isFetchingMore: boolean;
  userName?: string;
  userAvatarUrl?: string;
  chatId: string;
  onScroll: () => void;
  onImageLoaded: () => void;
}

export const MessageList = ({
  scrollRef,
  messages,
  isLoading,
  isFetchingMore,
  userName,
  userAvatarUrl,
  chatId,
  onScroll,
  onImageLoaded,
}: MessageListProps) => {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 space-y-4 overflow-y-auto bg-slate-50/30 p-4"
    >
      {isFetchingMore && (
        <div className="flex justify-center py-2 text-xs text-gray-400">
          <Loader2 className="mr-1 animate-spin" size={14} />
          Loading older messages...
        </div>
      )}
      {isLoading ? (
        <div className="flex h-full items-center justify-center text-gray-400">
          <Loader2 className="mr-2 animate-spin" /> Loading...
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-gray-400 italic">
          No messages yet
        </div>
      ) : (
        messages.map((msg, idx) => (
          <MessageItem
            key={msg.id || `${msg.senderId}-${msg.createdAt}-${idx}`}
            message={msg}
            index={idx}
            userName={userName}
            userAvatarUrl={userAvatarUrl}
            chatId={chatId}
            isFetchingMore={isFetchingMore}
            onImageLoaded={onImageLoaded}
          />
        ))
      )}
    </div>
  );
};
