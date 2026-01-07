import React, { memo } from 'react';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { IconButton } from '@/shared/components/IconButton';

interface PostActionsProps {
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  liked?: boolean;
  disableLike?: boolean;
  disableShare?: boolean;
  onLikeClick: () => void;
  onCommentClick: () => void;
  onShareClick: () => void;
}

export const PostActions = memo(
  ({
    likeCount = 0,
    commentCount = 0,
    shareCount = 0,
    liked = false,
    disableLike = false,
    disableShare = false,
    onLikeClick,
    onCommentClick,
    onShareClick,
  }: PostActionsProps) => {
    return (
      <div className="flex justify-between border-t px-4 py-1">
        <PostActionButton
          icon={ThumbsUp}
          label="Like"
          count={likeCount}
          onClick={onLikeClick}
          active={liked}
          disabled={disableLike}
        />
        <PostActionButton
          icon={MessageSquare}
          label="Comment"
          count={commentCount}
          onClick={onCommentClick}
        />
        <PostActionButton
          icon={Share2}
          label="Share"
          count={shareCount}
          onClick={onShareClick}
          disabled={disableShare}
        />
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
    active,
    disabled,
  }: {
    icon: React.ElementType;
    label: string;
    count?: number;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
  }) => (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      variant="default"
      className="flex flex-1 cursor-pointer items-center justify-center gap-2 text-gray-700"
    >
      <Icon size={18} className={active ? 'text-blue-600' : undefined} />
      <div className="flex items-center gap-1">
        <span
          className={active ? 'font-semibold text-blue-600' : 'font-normal'}
        >
          {label}
        </span>
        {count !== undefined && count > 0 && (
          <span
            className={
              active ? 'text-xs text-blue-600' : 'text-xs text-gray-700'
            }
          >
            ({count})
          </span>
        )}
      </div>
    </IconButton>
  )
);
PostActionButton.displayName = 'PostActionButton';
