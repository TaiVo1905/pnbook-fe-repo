import { useMemo, memo } from 'react';
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/core/shadcn/components/ui/button';
import type { Post, PostActionProps } from '../types/post.type';

export const PostCard = memo(({ post }: { post: Post }) => {
  const timeAgo = useMemo(
    () => new Date(post.createdAt).toLocaleDateString(),
    [post.createdAt]
  );

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="flex items-start justify-between p-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-pink-100">
            {post.user?.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user?.name || 'User avatar'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-bold text-pink-600">U</span>
            )}
          </div>
          <div>
            <h4 className="text-[15px] font-bold">
              {post.user?.name || 'Anonymous User'}
            </h4>
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      <div className="px-4 pb-4">
        <p className="mb-4 text-[15px] leading-relaxed">{post.content}</p>

        {post.attachments && post.attachments.length > 0 && (
          <div className="grid gap-2">
            {post.attachments.map((attachment) =>
              attachment.attachmentType === 'video' ? (
                <video
                  key={attachment.id}
                  src={attachment.attachmentUrl}
                  controls
                  className="max-h-[500px] w-full rounded-lg object-cover"
                />
              ) : (
                <img
                  key={attachment.id}
                  src={attachment.attachmentUrl}
                  alt="Post content"
                  className="max-h-[500px] w-full rounded-lg object-cover"
                />
              )
            )}
          </div>
        )}
      </div>

      <div className="text-muted-foreground mx-4 flex items-center justify-between border-b px-4 py-2 text-xs">
        <span>{post.reactionCount} Likes</span>
        <div className="flex gap-3">
          <span>0 Comments</span>
          <span>0 Shares</span>
        </div>
      </div>

      <div className="flex justify-between px-4 py-1">
        <PostAction icon={ThumbsUp} label="Like" />
        <PostAction icon={MessageSquare} label="Comment" />
        <PostAction icon={Share2} label="Share" />
      </div>
    </div>
  );
});

const PostAction = memo(({ icon: Icon, label, onClick }: PostActionProps) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="text-foreground/70 hover:text-primary flex-1 gap-2 py-5 transition-colors"
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </Button>
));
