import { memo } from 'react';
import { formatRelativeTime } from '@/shared/utils/date.util';
import { UserAvatar } from '@/shared/components/UserAvatar';
import type { Reply } from '../types/comment.type';

export const ReplyItem = memo(({ reply }: { reply: Reply }) => (
  <div className="flex gap-3">
    <UserAvatar name={reply.replier?.name} avatar={reply.replier?.avatarUrl} />
    <div className="overflow-hidden rounded-2xl bg-gray-100 px-3 py-2 text-sm">
      <div className="mb-1 flex items-center gap-2 text-sm">
        <div className="font-semibold">{reply.replier?.name || 'User'}</div>
        <span className="text-xs font-light">
          {formatRelativeTime(reply.createdAt)}
        </span>
      </div>
      <p className="text-foreground/80 break-words whitespace-pre-line">
        {reply.content}
      </p>
    </div>
  </div>
));
ReplyItem.displayName = 'ReplyItem';
