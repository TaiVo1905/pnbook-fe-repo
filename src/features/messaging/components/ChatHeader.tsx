import { UserAvatar } from '@/shared/components/UserAvatar';

interface ChatHeaderProps {
  userName?: string;
  userAvatarUrl?: string;
  chatId: string;
}

export const ChatHeader = ({
  userName,
  userAvatarUrl,
  chatId,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center gap-3 border-b bg-white p-4">
      <UserAvatar
        avatar={userAvatarUrl}
        name={userName || chatId}
        size="lg"
        className="shadow-sm"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">
          {userName || 'Chat'}
        </span>
        <span className="text-xs text-gray-400">Conversation</span>
      </div>
    </div>
  );
};
