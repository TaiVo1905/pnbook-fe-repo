import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Conversation } from '../types/messaging.type';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (payload: {
    id: string;
    name?: string;
    avatarUrl?: string;
  }) => void;
}

const formatTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const distance = formatDistanceToNow(date, {
    addSuffix: true,
    locale: enUS,
  });
  return distance.includes('less than a minute') ? 'Just now' : distance;
};

export const ConversationItem = ({
  conversation,
  isSelected,
  onSelect,
}: ConversationItemProps) => {
  const isUnread =
    conversation.lastMessage?.status !== 'read' &&
    conversation.lastMessage?.senderId === conversation.user?.id;

  const getBackgroundClass = () => {
    if (isSelected) return 'border-l-4 border-l-blue-500 bg-blue-50';
    if (isUnread) return 'bg-blue-50/60';
    return 'hover:bg-gray-50';
  };

  return (
    <div
      onClick={() =>
        onSelect({
          id: conversation.user?.id,
          name: conversation.user?.name,
          avatarUrl: conversation.user?.avatarUrl,
        })
      }
      className={`flex cursor-pointer items-center gap-3 border-b border-gray-50 p-4 transition-all ${getBackgroundClass()}`}
    >
      <img
        src={conversation.user?.avatarUrl || 'https://via.placeholder.com/150'}
        className="h-12 w-12 rounded-full border border-gray-100 object-cover shadow-sm"
        alt={conversation.user?.name}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline justify-between">
          <h4 className="truncate text-[15px] font-bold text-gray-800">
            {conversation.user?.name || 'Unknown User'}
          </h4>
          <div className="ml-2 flex items-center gap-2 whitespace-nowrap">
            {isUnread && (
              <span className="size-2 rounded-full bg-blue-500" aria-hidden />
            )}
            <span className="text-[10px] font-medium text-gray-400">
              {formatTime(conversation.lastMessageAt)}
            </span>
          </div>
        </div>
        <div
          className={`truncate text-[10px] ${
            isUnread
              ? 'font-semibold text-gray-900'
              : 'font-normal text-gray-600'
          }`}
        >
          {conversation.lastMessage?.contentType === 'text' &&
            conversation.lastMessage.content}
          {conversation.lastMessage?.contentType === 'attachment' &&
            `${conversation.user?.name || 'User'} sent an attachment`}
        </div>
      </div>
    </div>
  );
};
