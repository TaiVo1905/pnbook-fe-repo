'use client';

import { Button } from '@/core/shadcn/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/core/shadcn/components/ui/avatar';
import { UserMinus, UserCheck, UserX, Loader2 } from 'lucide-react';
import type { Friend } from '@/features/friend/types/friends.type';

interface FriendListCardProps {
  friend: Friend;
  onRemove: (id: string, newStatus: 'accepted' | 'block') => void;
  onUnfriend?: (id: string) => void;
  isLoading?: boolean;
}

export function FriendListCard({
  friend,
  onRemove,
  onUnfriend,
  isLoading = false,
}: FriendListCardProps) {
  const user = friend.friend;
  if (!user) return null;

  const isBlocked = friend.status === 'block';

  const initials =
    user.initials ??
    user.name
      ?.split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <div className="bg-card border-border rounded-lg border p-4">
      <div className="mb-4 flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{user.name}</p>
          {user.title && (
            <p className="text-muted-foreground text-sm">{user.title}</p>
          )}
          <p className="text-muted-foreground text-xs">
            Friends since {new Date(friend.connectedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-2 gap-3">
        <Button
          onClick={() =>
            onRemove(friend.friendId, isBlocked ? 'accepted' : 'block')
          }
          disabled={isLoading}
          variant={isBlocked ? 'outline' : 'secondary'}
          size="sm"
          className="h-8 w-full px-1 text-[11px]"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : isBlocked ? (
            <UserCheck className="mr-2 h-3 w-3" />
          ) : (
            <UserX className="mr-2 h-3 w-3" />
          )}

          {isBlocked ? 'Open Friend' : 'Block'}
        </Button>

        <Button
          onClick={() => onUnfriend?.(friend.friendId)}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full border-red-200 px-1 text-[11px] text-red-600 hover:bg-red-600/10"
        >
          <UserMinus className="mr-1 h-3 w-3" />
          Unfriend
        </Button>
      </div>
    </div>
  );
}
