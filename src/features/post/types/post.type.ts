import type { LucideIcon } from 'lucide-react';

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

export interface CreatePostPayload {
  content: string;
  image_url?: string;
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
