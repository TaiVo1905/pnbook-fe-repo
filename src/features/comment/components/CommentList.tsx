import { memo } from 'react';
import type { CommentListProps } from '../types/comment.type';
import { CommentItem } from './CommentItem';

export const CommentList = memo(
  ({ comments, onReplySubmit, onLoadReplies }: CommentListProps) => {
    if (!comments.length) {
      return (
        <div className="text-muted-foreground text-sm">No comments yet.</div>
      );
    }

    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReplySubmit={onReplySubmit}
            onLoadReplies={onLoadReplies}
          />
        ))}
      </div>
    );
  }
);
CommentList.displayName = 'CommentList';
