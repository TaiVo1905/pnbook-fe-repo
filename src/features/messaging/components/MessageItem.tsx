import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ChatImage } from './ChatImage';
import { UserAvatar } from '@/shared/components/UserAvatar';
import type { Message } from '../types/messaging.type';

interface MessageItemProps {
  message: Message;
  index: number;
  userName?: string;
  userAvatarUrl?: string;
  chatId: string;
  isFetchingMore: boolean;
  onImageLoaded: () => void;
}

const formatTime = (ts?: string) => {
  if (!ts) return 'Just now';
  try {
    const d = formatDistanceToNow(new Date(ts), {
      addSuffix: true,
      locale: enUS,
    });
    return d.includes('less than a minute') ? 'Just now' : d;
  } catch {
    return 'Just now';
  }
};

export const MessageItem = ({
  message,
  index,
  userName,
  userAvatarUrl,
  chatId,
  isFetchingMore,
  onImageLoaded,
}: MessageItemProps) => {
  const isMe = message.isMe === true;
  const isImage = message.contentType === 'attachment';

  return (
    <div
      key={message.id || `${message.senderId}-${message.createdAt}-${index}`}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
    >
      {!isMe && (
        <div className="mb-5 flex flex-shrink-0 items-center justify-center">
          <UserAvatar
            avatar={userAvatarUrl}
            name={userName || chatId}
            size="sm"
            className="shadow-sm"
          />
        </div>
      )}

      <div
        className={`flex flex-col ${
          isMe ? 'items-end' : 'items-start'
        } max-w-[75%]`}
      >
        <div
          className={`rounded-[20px] shadow-sm ${
            isMe
              ? 'rounded-br-none text-white'
              : 'rounded-bl-none border border-gray-100 bg-white text-gray-800'
          } ${isImage ? 'overflow-hidden' : 'bg-blue-600 px-4 py-2 text-[15px] break-words'} `}
        >
          {isImage ? (
            <ChatImage
              src={message.content}
              onLoaded={isFetchingMore ? () => {} : onImageLoaded}
            />
          ) : (
            <p className="leading-relaxed">{message.content}</p>
          )}
        </div>
        <span className="mt-1 px-1 text-[10px] text-gray-400">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};
