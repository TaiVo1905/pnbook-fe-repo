import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { getConversationList } from '../services/messaging.service';
import type { Conversation } from '../types/messaging.type';

interface ContactListProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
  searchTerm: string;
}

export const ContactList: React.FC<ContactListProps> = ({
  onSelect,
  selectedId,
  searchTerm,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversationList();

        if (response && response.statusCode === 200) {
          setConversations(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);
  const filtered = conversations.filter((c) =>
    c.user?.name?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const distance = formatDistanceToNow(date, {
      addSuffix: true,
      locale: enUS,
    });
    return distance.includes('less than a minute') ? 'Just now' : distance;
  };
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex animate-pulse gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="custom-scrollbar flex h-full flex-col overflow-y-auto bg-white">
      {filtered.length > 0 ? (
        filtered.map((item) => (
          <div
            key={item.user?.id}
            onClick={() => onSelect(item.user?.id)}
            className={`flex cursor-pointer items-center gap-3 border-b border-gray-50 p-4 transition-all ${
              selectedId === item.user?.id
                ? 'border-l-4 border-l-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <img
              src={item.user?.avatarUrl || 'https://via.placeholder.com/150'}
              className="h-12 w-12 rounded-full border border-gray-100 object-cover shadow-sm"
              alt={item.user?.name}
            />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-baseline justify-between">
                <h4 className="truncate text-[15px] font-bold text-gray-800">
                  {item.user?.name || 'Unknown User'}
                </h4>
                <span className="ml-2 text-[10px] font-medium whitespace-nowrap text-gray-400">
                  {formatTime(item.lastMessageAt)}
                </span>
              </div>
              {/* <div>{item.lastMessage?.content || 'No messages yet'}</div> */}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <p className="text-sm text-gray-400">No conversations found</p>
        </div>
      )}
    </div>
  );
};
