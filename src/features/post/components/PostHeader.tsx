import { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/core/shadcn/components/ui/button';
import type { UserPreview } from '@/shared/types/user.type';

interface PostHeaderProps {
  poster: UserPreview;
  createdAt: string;
  isShared?: boolean;
  onMoreClick?: () => void;
}

export const PostHeader = memo(
  ({ poster, createdAt, isShared, onMoreClick }: PostHeaderProps) => {
    const timeAgo = formatDistanceToNow(new Date(createdAt), {
      addSuffix: true,
    });

    return (
      <div className="flex items-start justify-between p-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-pink-100">
            {poster?.avatarUrl ? (
              <img
                src={poster.avatarUrl}
                className="h-full w-full object-cover"
                alt={poster.name}
              />
            ) : (
              <span className="font-bold text-pink-600">U</span>
            )}
          </div>
          <div>
            <h4 className="text-[15px] font-bold">
              {poster?.name || 'Anonymous User'}
            </h4>
            {isShared && (
              <div className="text-[11px] font-semibold text-blue-600">
                Shared a post
              </div>
            )}
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onMoreClick}
        >
          <MoreHorizontal size={20} />
        </Button>
      </div>
    );
  }
);
PostHeader.displayName = 'PostHeader';
