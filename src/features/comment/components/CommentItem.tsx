import { memo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/core/shadcn/components/ui/button';
import { Input } from '@/core/shadcn/components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/core/shadcn/components/ui/avatar';
import { cn } from '@/core/shadcn/utils/utils';
import type {
  CommentWithReplies,
  CommentListProps,
} from '../types/comment.type';
import { ReplyItem } from './ReplyItem';

const formatTimestamp = (value: string) => {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
};

const UserAvatar = ({
  name,
  avatar,
  className,
}: {
  name?: string;
  avatar?: string;
  className?: string;
}) => (
  <Avatar className={cn('h-9 w-9', className)}>
    {avatar ? <AvatarImage src={avatar} /> : null}
    <AvatarFallback>{name?.charAt(0) || 'U'}</AvatarFallback>
  </Avatar>
);

export const CommentItem = memo(
  ({
    comment,
    onReplySubmit,
    onLoadReplies,
  }: {
    comment: CommentWithReplies;
    onReplySubmit: CommentListProps['onReplySubmit'];
    onLoadReplies: CommentListProps['onLoadReplies'];
  }) => {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const replyCount = comment._count?.replies ?? comment.replies?.length ?? 0;

    const handleReply = async () => {
      const text = replyText.trim();
      if (!text) return;
      setSubmitting(true);
      try {
        await onReplySubmit(comment.id, text);
        setReplyText('');
        setShowReply(false);
      } finally {
        setSubmitting(false);
      }
    };

    const handleLoadReplies = async () => {
      if (showReplies) {
        setShowReplies(false);
        return;
      }
      setLoadingReplies(true);
      try {
        await onLoadReplies(comment.id);
        setShowReplies(true);
      } finally {
        setLoadingReplies(false);
      }
    };

    return (
      <div className="bg-muted/40 space-y-3 rounded-2xl p-3">
        <div className="flex gap-3">
          <UserAvatar
            name={comment.commenter?.name}
            avatar={comment.commenter?.avatarUrl}
          />
          <div className="w-full">
            <div className="bg-card/70 rounded-2xl px-3 py-2 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-sm">
                <div className="font-semibold">
                  {comment.commenter?.name || 'User'}
                </div>
                <span className="text-xs font-light">
                  {formatTimestamp(comment.createdAt)}
                </span>
              </div>
              <p className="text-foreground/80 whitespace-pre-line">
                {comment.content}
              </p>
            </div>
            <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
              <button
                className="hover:text-foreground cursor-pointer font-medium transition-colors"
                onClick={() => setShowReply((prev) => !prev)}
              >
                Reply
              </button>
              {replyCount > 0 && (
                <button
                  className="hover:text-foreground cursor-pointer font-medium transition-colors"
                  onClick={handleLoadReplies}
                  disabled={loadingReplies}
                >
                  {loadingReplies
                    ? 'Loading...'
                    : showReplies
                      ? 'Hide replies'
                      : `View ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
                </button>
              )}
            </div>

            {showReply && (
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={submitting}
                  className="cursor-pointer"
                >
                  {submitting ? 'Posting...' : 'Reply'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="border-l pl-6">
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
CommentItem.displayName = 'CommentItem';
