import { useEffect, useState } from "react";
import { useNotification } from "../hooks/useNotification";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotification"; // Import hook
import { NotificationTabs } from "../components/NotificationTab";
import { NotificationContent } from "../components/NotificationContent";
import { userApi } from "@/core/api/user.api";

export const NotificationPage = () => {
  const { notifications, setNotifications, loading, markAsRead } = useNotification();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await userApi.getCurrentUser();
      const currentUserId = response.data.id;
      setCurrentUserId(currentUserId);
    };
    fetchCurrentUser();
  }, [])

  useRealtimeNotifications({
    currentUserId,
    onNotificationReceived: setNotifications,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredData = notifications.filter((n) =>
    activeTab === "all" ? true : !n.isRead
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto p-4 sm:p-6 transition-all duration-500">
        <NotificationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          unreadCount={unreadCount} 
        />

        <NotificationContent 
          loading={loading} 
          data={filteredData} 
          onRead={markAsRead} 
        />
      </main>
    </div>
  );
};