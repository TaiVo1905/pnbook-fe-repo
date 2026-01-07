import { memo } from 'react';
import { Button } from '@/core/shadcn/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { UserInfo } from '@/features/friend/types/friends.type';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

interface FriendSuggestion {
  user: UserInfo;
  status: 'idle' | 'pending';
}

interface Props {
  suggestion: FriendSuggestion;
  onToggle: (userId: string) => void;
  isLoading?: boolean;
}

export const FriendSuggestionCard = memo(
  ({ suggestion, onToggle, isLoading = false }: Props) => {
    const { user, status } = suggestion;
    const isPending = status === 'pending';

    const initials =
      user.initials ??
      user.name
        ?.split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
      <div className="bg-card flex items-center gap-3 rounded-lg border p-4">
        <Avatar className="h-10 w-10 overflow-hidden rounded-full">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="flex h-full w-full items-center justify-center">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <p className="font-semibold">{user.name}</p>
        </div>

        <Button
          type="button"
          disabled={isLoading || status === 'pending'}
          variant={isPending ? 'secondary' : 'default'}
          onClick={() => onToggle(user.id)}
          className="transition-colors duration-200 hover:bg-blue-600 hover:text-white"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Sent' : 'Add Friend'}
        </Button>
      </div>
    );
  }
);

FriendSuggestionCard.displayName = 'FriendSuggestionCard';
