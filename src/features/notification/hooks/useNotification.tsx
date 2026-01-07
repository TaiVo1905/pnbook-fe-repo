import { useCallback, useEffect, useState } from "react";
import { getNotification, readNotification } from "../services/NotificationService"; 
import type { Notifications } from "../types/NotificationType";
import { toast } from "sonner";

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notifications[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getNotification();
            if (response && response.statusCode === 200) {
                // Đảm bảo data luôn là mảng để tránh lỗi .map() ở UI
                setNotifications(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            toast.error('Không thể tải thông báo');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = useCallback(async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );

        try {
            await readNotification(id);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            fetchNotifications(); 
        }
    }, [fetchNotifications]);


    const markAllAsRead = useCallback(async () => {
        if (notifications.length === 0) return;

        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        
        try {
            toast.success("Đã đánh dấu tất cả là đã đọc");
        } catch (error) {
            fetchNotifications();
        }
    }, [notifications.length, fetchNotifications]);

    return { 
        notifications, 
        setNotifications,
        loading, 
        markAsRead, 
        markAllAsRead, 
        refresh: fetchNotifications 
    };
};