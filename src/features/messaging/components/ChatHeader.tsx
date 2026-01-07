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
      {userAvatarUrl ? (
        <img
          src={userAvatarUrl}
          alt={userName || 'User avatar'}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white uppercase">
          {(userName || chatId || '??').substring(0, 2)}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">
          {userName || 'Chat'}
        </span>
        <span className="text-xs text-gray-400">Conversation</span>
      </div>
    </div>
  );
};
