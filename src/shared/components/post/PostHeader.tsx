import { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { IconButton } from '@/shared/components/IconButton';
import type { UserPreview } from '@/shared/types/user.type';
import { UserAvatar } from '../UserAvatar';

interface PostHeaderProps {
  poster: UserPreview;
  createdAt: string;
  onMoreClick?: () => void;
}

export const PostHeader = memo(
  ({ poster, createdAt, onMoreClick }: PostHeaderProps) => {
    const timeAgo = formatDistanceToNow(new Date(createdAt), {
      addSuffix: true,
    });

    return (
      <div className="flex items-start justify-between p-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-pink-100">
            <UserAvatar
              name={poster.name}
              avatar={poster.avatarUrl}
              className="h-full w-full"
            />
          </div>
          <div>
            <h4 className="text-[15px] font-bold">
              {poster?.name || 'Anonymous User'}
            </h4>
            <span className="text-muted-foreground flex text-[12px]">
              {timeAgo}
            </span>
          </div>
        </div>
        <IconButton variant="default" onClick={onMoreClick}>
          <MoreHorizontal size={20} />
        </IconButton>
      </div>
    );
  }
);
PostHeader.displayName = 'PostHeader';
