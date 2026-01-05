import { useState } from 'react';
import { Search } from 'lucide-react';
import { ContactList } from '../components/ContactList';
import ChatWindow from '../components/ChatWindow';

const MessagingPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="h-full w-full bg-slate-50 p-4 lg:p-6">
      <div className="mx-auto flex h-[calc(100vh-100px)] max-w-[1200px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
        <div className="flex w-[320px] flex-col border-r bg-white lg:w-[380px]">
          <div className="border-b p-4">
            <div className="relative">
              <Search
                className="absolute top-2.5 left-3 text-gray-400"
                size={18}
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full bg-[#f0f2f5] py-2 pr-4 pl-10 outline-none"
                placeholder="Search conversations..."
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ContactList
              onSelect={setSelectedId}
              selectedId={selectedId}
              searchTerm={searchTerm}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          {selectedId ? (
            <ChatWindow chatId={selectedId} />
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-400">
              Please choose a conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
