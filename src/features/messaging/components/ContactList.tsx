import { useConversations } from '../hooks/useConversations';
import { ConversationItem } from './ConversationItem';
import { LoadingSkeleton } from './LoadingSkeleton';

interface ContactListProps {
  onSelect: (payload: {
    id: string;
    name?: string;
    avatarUrl?: string;
  }) => void;
  selectedId: string | null;
  searchTerm: string;
}

export const ContactList = ({
  onSelect,
  selectedId,
  searchTerm,
}: ContactListProps) => {
  const { conversations, loading, markAsRead } = useConversations();

  const handleSelect = (payload: {
    id: string;
    name?: string;
    avatarUrl?: string;
  }) => {
    onSelect(payload);
    markAsRead(payload.id);
  };

  const filtered = conversations.filter((c) =>
    c.user?.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="custom-scrollbar flex h-full flex-col overflow-y-auto bg-white">
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
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <p className="text-sm text-gray-400">No conversations found</p>
        </div>
      )}
    </div>
  );
};
