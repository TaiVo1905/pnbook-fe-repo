import type {
  Notifications,
  NotificationResponse,
} from '../types/NotificationType';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getNotification = async () => {
  const url = `${API_URL}/notifications/me`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Lỗi API: ${response.status}`);
  }

  return await response.json();
};

export const readNotification = async (
  id: string
): Promise<NotificationResponse<Notifications>> => {
  const res = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - Failed to read notification`);
  }

  return res.json();
};
