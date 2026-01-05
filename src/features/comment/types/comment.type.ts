import type { UserPreview } from '@/shared/types/user.type';

export interface Comment {
  id: string;
  postId: string;
  commenterId: string;
  content: string;
  createdAt: string;
  commenter?: UserPreview;
}

export interface Reply {
  id: string;
  commentId: string;
  replierId: string;
  content: string;
  createdAt: string;
  replier?: UserPreview;
}

export interface CommentWithReplies extends Comment {
  replies?: Reply[];
}

export interface CommentListProps {
  comments: CommentWithReplies[];
  onReplySubmit: (commentId: string, content: string) => Promise<void>;
  onLoadReplies: (commentId: string) => Promise<void>;
}
