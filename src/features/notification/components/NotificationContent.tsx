import { BellRing } from "lucide-react";
import type { Notifications } from "../types/NotificationType";
import { NotificationItem } from "./NotificationItem";

interface ContentProps {
  loading: boolean;
  data: Notifications[];
  onRead: (id: string) => void;
}

export const NotificationContent = ({ loading, data, onRead }: ContentProps) => {
  if (loading && data.length === 0) {
    return (
      <div className="w-200 flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-4 flex flex-col space-y-1">
      {data.length > 0 ? (
        data.map((item) => (
          <NotificationItem key={item.id} item={item} onRead={onRead} />
        ))
      ) : (
        <div className=" text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-inner mt-4">
          <div className=" w-200 h-10  flex items-center justify-center mx-auto mb-4 text-gray-300">
            <BellRing size={32} />
          </div>
          <p className="text-gray-400 font-medium">No notifications to display.</p>
        </div>
      )}
    </div>
  );
};