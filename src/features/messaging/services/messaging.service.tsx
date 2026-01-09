import type {
  MessagingResponse,
  Message,
  Conversation,
  User,
} from '../types/messaging.type';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getConversationList = async (): Promise<
  MessagingResponse<Conversation[]>
> => {
  const res = await fetch(`${API_URL}/conversations`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.json();
};

export const searchUsersByName = async (
  keyword: string
): Promise<MessagingResponse<User[]>> => {
  const res = await fetch(
    `${API_URL}/search/users?keyword=${encodeURIComponent(keyword)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  return res.json();
};

export const getMessagesByConversationId = async (
  receiverId: string,
  page = 1,
  limit = 20
): Promise<MessagingResponse<Message[]>> => {
  const res = await fetch(
    `${API_URL}/messages?receiverId=${receiverId}&page=${page}&limit=${limit}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  return res.json();
};

export const sendMessage = async (payload: {
  receiverId: string;
  content: string;
  contentType: 'text' | 'attachment';
}): Promise<MessagingResponse<Message>> => {
  const res = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const uploadMedia = async (file: File): Promise<string> => {
  const res = await fetch(`${API_URL}/get-presigned-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type,
    }),
  });

  if (!res.ok) throw new Error('Cannot get presigned url');

  const { data } = await res.json();
  const { url, key } = data;
  const uploadRes = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error('Upload failed');
  return key;
};

export const markAsRead = async (receiverId: string): Promise<void> => {
  await fetch(`${API_URL}/messages/mark-as-read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ receiverId }),
  });
};
