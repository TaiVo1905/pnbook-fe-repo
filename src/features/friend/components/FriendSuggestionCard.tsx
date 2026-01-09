import { memo } from 'react';
import { Button } from '@/core/shadcn/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UserAvatar } from '@/shared/components/UserAvatar';
import type { FriendSuggestion } from '@/features/friend/utils/friend.util';

interface Props {
  suggestion: FriendSuggestion;
  onToggle: (userId: string) => void;
  isLoading?: boolean;
}

export const FriendSuggestionCard = memo(
  ({ suggestion, onToggle, isLoading = false }: Props) => {
    const { user, status } = suggestion;
    const isPending = status === 'pending';

    return (
      <div className="bg-card flex items-center gap-3 rounded-lg border p-4">
        <UserAvatar avatar={user.avatarUrl} name={user.name} size="md" />

        <div className="flex-1">
          <p className="font-semibold">{user.name}</p>
        </div>

        <Button
          type="button"
          disabled={isLoading || status === 'pending'}
          variant={isPending ? 'secondary' : 'default'}
          onClick={() => onToggle(user.id)}
          className="h-8 cursor-pointer bg-blue-600 px-3 text-sm text-white transition-colors duration-200 hover:bg-blue-700 hover:text-white"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Sent' : 'Add Friend'}
        </Button>
      </div>
    );
  }
);

FriendSuggestionCard.displayName = 'FriendSuggestionCard';
