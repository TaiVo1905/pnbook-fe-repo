export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Message {
  contentType: string;
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string;
  createdAt: string;
  isMe?: boolean;
  imageUrl?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: Message;
  content: string;
  unreadCount: number;
  lastMessageAt: string;
  timeAgo: string;
}

export interface MessagingResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
  meta?: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
