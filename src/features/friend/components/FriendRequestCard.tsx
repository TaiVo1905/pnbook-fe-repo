import { Button } from '@/core/shadcn/components/ui/button';
import { UserPlus, UserX, Loader2 } from 'lucide-react';
import type { FriendRequest } from '@/features/friend/types/friends.type';

interface FriendRequestCardProps {
  request: FriendRequest;
  onSend: (userId: string) => void;
  onCancel: (userId: string) => void;
  isLoading?: boolean;
}

export function FriendRequestCard({
  request,
  onSend,
  onCancel,
  isLoading = false,
}: FriendRequestCardProps) {
  const user = request.receiver;
  const isRequested = request.status === 'pending';

  return (
    <div className="bg-card border-border rounded-lg border p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{user.name}</p>
          {user.title && (
            <p className="text-muted-foreground text-sm">{user.title}</p>
          )}
        </div>
      </div>

      {isRequested ? (
        <Button
          onClick={() => onCancel(user.id)}
          disabled={isLoading}
          variant="secondary"
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserX className="mr-2 h-4 w-4" />
          )}
          Cancel
        </Button>
      ) : (
        <Button
          onClick={() => onSend(user.id)}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Send
        </Button>
      )}
    </div>
  );
}
