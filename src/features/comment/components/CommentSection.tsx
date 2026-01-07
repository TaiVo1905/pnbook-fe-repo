import { memo, useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/core/shadcn/components/ui/input';
import { IconButton } from '@/shared/components/IconButton';
import { CommentList } from '@/features/comment/components/CommentList';
import { useComments } from '@/features/comment/hooks/useComments';
import type { UserPreview } from '@/shared/types/user.type';

interface CommentSectionProps {
  postId: string;
  currentUser?: UserPreview;
  isOpen: boolean;
}

export const CommentSection = memo(
  ({ postId, currentUser, isOpen }: CommentSectionProps) => {
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    const {
      comments,
      loadingComments,
      fetchComments,
      createComment,
      createReply,
      loadReplies,
    } = useComments(postId);

    useEffect(() => {
      if (isOpen) {
        fetchComments();
      }
    }, [isOpen, fetchComments]);

    const handleSubmitComment = async () => {
      const content = commentText.trim();
      if (!content) return;
      setSubmittingComment(true);
      try {
        const success = await createComment(content);
        if (success) {
          setCommentText('');
        }
      } finally {
        setSubmittingComment(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="bg-muted/20 space-y-4 border-t px-4 py-4">
        <div className="space-y-3">
          {loadingComments ? (
            <div className="text-muted-foreground text-sm">
              Loading comments...
            </div>
          ) : (
            <CommentList
              comments={comments}
              onReplySubmit={async (commentId, content) => {
                await createReply(commentId, content);
              }}
              onLoadReplies={loadReplies}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-pink-100">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                className="h-full w-full object-cover"
                alt={currentUser.name}
              />
            ) : (
              <span className="font-bold text-pink-600">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-2xl bg-gray-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <IconButton
            onClick={handleSubmitComment}
            disabled={submittingComment || !commentText.trim()}
            variant="default"
          >
            <Send size={20} />
          </IconButton>
        </div>
      </div>
    );
  }
);
CommentSection.displayName = 'CommentSection';
