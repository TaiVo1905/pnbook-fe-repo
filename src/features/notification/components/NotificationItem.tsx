import type { Notifications } from "../types/NotificationType";
import { parseISO, formatDistanceToNow } from 'date-fns';

interface ItemProps {
  item: Notifications;
  onRead: (id: string) => void;
}

const formatRelativeTime = (dateString: string) => {
  const distance = formatDistanceToNow(parseISO(dateString), { 
    addSuffix: true,
  });
  return distance.charAt(0).toUpperCase() + distance.slice(1);
};

export const NotificationItem = ({ item, onRead }: ItemProps) => {
  
  return (
    <div
      onClick={() => !item.isRead && onRead(item.id)}
      className={`flex w-200 items-start p-4 mb-3 rounded-2xl transition-all cursor-pointer  border ${
        !item.isRead ? "bg-blue-50 border-transparent" : "bg-white border-gray-100"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-400 to-pink-400 shrink-0 flex items-center justify-center text-white font-bold">
        {item.title.charAt(0).toUpperCase()}
      </div>

      <div className="ml-4 flex-1">
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 leading-tight">{item.title}</span>
          <p className="text-gray-600 text-sm mt-0.5 line-clamp-2">{item.content}</p>
        </div>
        <div className="flex items-center mt-2 gap-2">
          <span className="text-gray-400 text-[10px] font-medium uppercase">
            {item.createdAt ? formatRelativeTime(item.createdAt) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};
