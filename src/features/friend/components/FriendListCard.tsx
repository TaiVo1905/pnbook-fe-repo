'use client';

import { Button } from '@/core/shadcn/components/ui/button';
import { UserMinus, UserX, Loader2 } from 'lucide-react';
import type { UserInfo } from '@/features/friend/types/friends.type';
import { UserAvatar } from '@/shared/components/UserAvatar';

interface FriendListCardProps {
  friend: UserInfo;
  onRemove: (id: string, shouldBlock: boolean) => void;
  onUnfriend?: (id: string) => void;
  isLoading?: boolean;
  isBlocked?: boolean;
}

export function FriendListCard({
  friend,
  onRemove,
  onUnfriend,
  isLoading = false,
  isBlocked = false,
}: FriendListCardProps) {
  return (
    <div className="bg-card border-border rounded-lg border p-4">
      <div className="mb-4 flex items-start gap-3">
        <UserAvatar avatar={friend.avatarUrl} name={friend.name}></UserAvatar>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{friend.name}</p>
          {friend.title && (
            <p className="text-muted-foreground text-sm">{friend.title}</p>
          )}
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-2 gap-3">
        <Button
          onClick={() => onRemove(friend.id, !isBlocked)}
          disabled={isLoading}
          variant="secondary"
          size="sm"
          className={`h-8 w-full cursor-pointer px-1 text-sm transition-colors ${
            isBlocked
              ? 'bg-gray-500 text-white hover:bg-gray-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <UserX className="mr-2 h-3 w-3" />
          )}
          {isBlocked ? 'Unblock' : 'Block'}
        </Button>

        <Button
          onClick={() => onUnfriend?.(friend.id)}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="w-full border-gray-200 border-red-200 bg-transparent px-1 text-sm text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <UserMinus className="mr-1 h-3 w-3" />
          Unfriend
        </Button>
      </div>
    </div>
  );
}
