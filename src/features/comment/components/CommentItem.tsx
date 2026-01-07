import { memo, useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/core/shadcn/components/ui/input';
import { formatRelativeTime } from '@/shared/utils/date.util';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { IconButton } from '@/shared/components/IconButton';
import type {
  CommentWithReplies,
  CommentListProps,
} from '../types/comment.type';
import { ReplyItem } from './ReplyItem';

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
      <div className="bg-muted/40 space-y-2 rounded-2xl p-1">
        <div className="flex gap-3">
          <UserAvatar
            name={comment.commenter?.name}
            avatar={comment.commenter?.avatarUrl}
          />
          <div className="overflow-hidden">
            <div className="rounded-2xl bg-gray-100 px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="font-semibold">
                  {comment.commenter?.name || 'User'}
                </div>
                <span className="text-xs font-light">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-foreground/80 break-words whitespace-pre-line">
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
          </div>
        </div>

        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="pl-12">
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </div>
          </div>
        )}
        {showReply && (
          <div className="mt-2 ml-12 flex items-center gap-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 rounded-2xl bg-gray-50"
            />
            <IconButton
              onClick={handleReply}
              disabled={submitting || !replyText.trim()}
              variant="default"
            >
              <Send size={20} />
            </IconButton>
          </div>
        )}
      </div>
    );
  }
);
CommentItem.displayName = 'CommentItem';
