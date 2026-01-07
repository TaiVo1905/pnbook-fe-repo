import { useState } from 'react';
import { ContactList } from '../components/ContactList';
import ChatWindow from '../components/ChatWindow';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

const MessagingPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | undefined>(
    undefined
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUserId } = useCurrentUser();

  return (
    <div className="h-full w-full bg-slate-50">
      <div className="mx-auto flex h-[calc(100vh-100px)] max-w-[1000px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
        <div className="flex w-[250px] flex-col border-r bg-white lg:w-[300px]">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <div className="flex-1 overflow-y-auto">
            <ContactList
              onSelect={({ id, name, avatarUrl }) => {
                setSelectedId(id);
                setSelectedName(name);
                setSelectedAvatar(avatarUrl);
              }}
              selectedId={selectedId}
              searchTerm={searchTerm}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          {selectedId ? (
            <ChatWindow
              chatId={selectedId}
              userName={selectedName}
              userAvatarUrl={selectedAvatar}
              currentUserId={currentUserId}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
