import { Button } from '@/core/shadcn/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { FriendRequest } from '@/features/friend/types/friends.type';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAction: (userId: string, status: 'pending' | 'idle') => void;
  isLoading?: boolean;
}

export function FriendRequestCard({
  request,
  onAction,
  isLoading = false,
}: FriendRequestCardProps) {
  const user = request.addressee;
  const isPending = request.status === 'pending';

  return (
    <div className="bg-card rounded-lg border p-4">
      <p className="mb-3 font-semibold">{user.name}</p>

      <Button
        onClick={() => onAction(user.id, isPending ? 'idle' : 'pending')}
        disabled={isLoading}
        variant={isPending ? 'secondary' : 'default'}
        className="w-full"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? 'Cancel' : 'Send'}
      </Button>
    </div>
  );
}
