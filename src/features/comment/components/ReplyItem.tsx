import { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/core/shadcn/components/ui/avatar';
import { cn } from '@/core/shadcn/utils/utils';
import type { Reply } from '../types/comment.type';

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

export const ReplyItem = memo(({ reply }: { reply: Reply }) => (
  <div className="flex gap-3">
    <UserAvatar name={reply.replier?.name} avatar={reply.replier?.avatarUrl} />
    <div className="bg-muted/60 rounded-2xl px-3 py-2 text-sm">
      <div className="mb-1 flex items-center gap-2 text-sm">
        <div className="font-semibold">{reply.replier?.name || 'User'}</div>
        <span className="text-xs font-light">
          {formatTimestamp(reply.createdAt)}
        </span>
      </div>
      <p className="text-foreground/80 whitespace-pre-line">{reply.content}</p>
    </div>
  </div>
));
ReplyItem.displayName = 'ReplyItem';
