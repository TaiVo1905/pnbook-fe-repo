import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { UserPreview } from '@/shared/types/user.type';

export interface PostLayoutProps {
  children?: ReactNode;
}
export interface Attachment {
  id: string;
  postId: string;
  attachmentUrl: string;
  attachmentType: 'image' | 'video' | 'audio';
  createdAt: string;
  deletedAt: string | null;
}

export interface Post {
  id: string;
  posterId: string;
  content: string;
  originalPostId: string | null;
  reactionCount: number;
  reacted?: boolean;
  isReacted?: boolean;
  createdAt: string;
  deletedAt: string | null;
  attachments: Attachment[];
  poster: UserPreview;
  originalPost?: Omit<Post, 'originalPost'>;
  _count: {
    comments: number;
    shares: number;
  };
}

export interface CreatePostAttachment {
  key: string;
  attachmentUrl?: string;
  type: 'image' | 'video' | 'audio';
  file?: File;
  mimeType?: string;
}

export interface UploadedAttachment {
  key: string;
  attachmentUrl?: string;
  type: 'image' | 'video' | 'audio';
}

export interface UpdatePostPayload {
  content: string;
  attachments?: UploadedAttachment[];
  originalPostId?: string | null;
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
  attachments?: UploadedAttachment[];
}

export interface PresignedUrlRequest {
  filename: string;
  mimeType: string;
}

export interface PresignedUrlResponse {
  key: string;
  url: string;
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
