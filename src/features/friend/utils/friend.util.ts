import type { UserInfo } from '@/features/friend/types/friends.type';

export function getUserInitials(name?: string, initials?: string): string {
  if (initials) return initials;

  if (!name) return 'U';

  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export interface FriendSuggestion {
  user: UserInfo;
  status: 'idle' | 'pending';
}

export function createFriendSuggestion(
  user: UserInfo,
  isPending = false
): FriendSuggestion {
  return {
    user,
    status: isPending ? 'pending' : 'idle',
  };
}
