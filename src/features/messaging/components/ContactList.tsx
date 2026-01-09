import { useUserSearch } from '../hooks/useUserSearch';
import { ConversationItem } from './ConversationItem';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';
import { UserAvatar } from '@/shared/components/UserAvatar';
import type { User, Conversation } from '../types/messaging.type';

interface ContactListProps {
  onSelect: (payload: {
    id: string;
    name?: string;
    avatarUrl?: string;
  }) => void;
  selectedId: string | null;
  searchTerm: string;
  currentUserId?: string | null;
  conversations: Conversation[];
  loadingConversations: boolean;
  markAsRead: (userId: string) => void;
}

export const ContactList = ({
  onSelect,
  selectedId,
  searchTerm,
  currentUserId,
  conversations,
  loadingConversations,
  markAsRead,
}: ContactListProps) => {
  const { results: userResults, loading: searching } =
    useUserSearch(searchTerm);

  const handleSelect = (payload: {
    id: string;
    name?: string;
    avatarUrl?: string;
  }) => {
    onSelect(payload);
    const isExistingConversation = conversations.some(
      (c) => c.user?.id === payload.id
    );
    if (isExistingConversation) {
      markAsRead(payload.id);
    }
  };

  const filtered = conversations.filter((c) =>
    c.user?.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  const filteredUsers = userResults
    .filter((u) => u.id !== currentUserId)
    .filter((u) => !conversations.some((c) => c.user?.id === u.id));

  if (loadingConversations) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="custom-scrollbar flex h-full flex-col overflow-y-auto bg-white">
      <SectionTitle label="Conversations" />
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <ConversationItem
            key={item.user?.id}
            conversation={item}
            isSelected={selectedId === item.user?.id}
            onSelect={handleSelect}
          />
        ))
      ) : (
        <EmptyState />
      )}

      {searchTerm.trim() && (
        <div className="border-t bg-white">
          <SectionTitle label="People" isLoading={searching} />
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserResultItem
                key={user.id}
                user={user}
                onSelect={handleSelect}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
};

const SectionTitle = ({
  label,
  isLoading,
}: {
  label: string;
  isLoading?: boolean;
}) => (
  <div className="flex items-center justify-between px-4 pt-4 pb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
    <span>{label}</span>
    {isLoading && (
      <span className="text-[10px] text-gray-400">Searching...</span>
    )}
  </div>
);

const UserResultItem = ({
  user,
  onSelect,
}: {
  user: User;
  onSelect: (payload: {
    id: string;
    name?: string;
    avatarUrl?: string;
  }) => void;
}) => {
  return (
    <div
      onClick={() =>
        onSelect({ id: user.id, name: user.name, avatarUrl: user.avatarUrl })
      }
      className="flex cursor-pointer items-center gap-3 border-b border-gray-50 p-4 transition-all hover:bg-gray-50"
    >
      <UserAvatar
        avatar={user.avatarUrl}
        name={user.name}
        size="lg"
        className="border border-gray-100 shadow-sm"
      />
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[15px] font-semibold text-gray-800">
          {user.name}
        </h4>
        <p className="text-[11px] text-gray-500">Start a conversation</p>
      </div>
    </div>
  );
};
