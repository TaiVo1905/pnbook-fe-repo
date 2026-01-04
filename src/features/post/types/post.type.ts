import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface PostLayoutProps {
  children?: ReactNode;
}
export interface Attachment {
  id: string;
  postId: string;
  attachmentUrl: string;
  attachmentType: 'image' | 'video';
  createdAt: string;
  deletedAt: string | null;
}

export interface Post {
  id: string;
  posterId: string;
  content: string;
  originalPostId: string | null;
  reactionCount: number;
  createdAt: string;
  deletedAt: string | null;
  attachments: Attachment[];
  user?: {
    name: string;
    avatar: string;
  };
}

export interface CreatePostAttachment {
  key: string;
  attachmentUrl: string;
  type: 'image' | 'video';
  file?: File;
  mimeType?: string;
}

export interface UploadedAttachment {
  key: string;
  attachmentUrl: string;
  type: 'image' | 'video';
}

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export interface ApiError {
  message: string;
}

export interface CreatePostPayload {
  content: string;
  originalPostId?: string;
  attachments: UploadedAttachment[];
}

export interface PresignedUrlRequest {
  filename: string;
  mimeType: string;
}

export interface PresignedUrlResponse {
  key: string;
  url: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Reply {
  id: string;
  commentId: string;
  userId: string;
  content: string;
}

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  active?: boolean;
}

export interface PostActionProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}
