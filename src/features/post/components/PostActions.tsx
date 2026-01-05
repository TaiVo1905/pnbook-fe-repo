import React, { memo } from 'react';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/core/shadcn/components/ui/button';

interface PostActionsProps {
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  onCommentClick: () => void;
}

export const PostActions = memo(
  ({
    likeCount = 0,
    commentCount = 0,
    shareCount = 0,
    onCommentClick,
  }: PostActionsProps) => {
    return (
      <div className="flex justify-between border-t px-4 py-1">
        <PostActionButton icon={ThumbsUp} label="Like" count={likeCount} />
        <PostActionButton
          icon={MessageSquare}
          label="Comment"
          count={commentCount}
          onClick={onCommentClick}
        />
        <PostActionButton icon={Share2} label="Share" count={shareCount} />
      </div>
    );
  }
);
PostActions.displayName = 'PostActions';

const PostActionButton = memo(
  ({
    icon: Icon,
    label,
    count,
    onClick,
  }: {
    icon: React.ElementType;
    label: string;
    count?: number;
    onClick?: () => void;
  }) => (
    <Button
      variant="ghost"
      onClick={onClick}
      className="text-foreground/70 flex flex-1 cursor-pointer items-center justify-center gap-2 py-5"
    >
      <Icon size={18} />
      <div className="flex items-center gap-1">
        <span className="font-medium">{label}</span>
        {count !== undefined && count > 0 && (
          <span className="text-muted-foreground text-xs">({count})</span>
        )}
      </div>
    </Button>
  )
);
PostActionButton.displayName = 'PostActionButton';
