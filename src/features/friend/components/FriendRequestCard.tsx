import { memo } from 'react';
import { ActionButton } from '@/shared/components/ActionButton';
import { UserPlus, UserX } from 'lucide-react';
import type { FriendRequest } from '@/features/friend/types/friends.type';

interface FriendRequestCardProps {
  request: FriendRequest;
  onSend: (userId: string) => void;
  onCancel: (userId: string) => void;
  isLoading?: boolean;
}

export const FriendRequestCard = memo(
  ({
    request,
    onSend,
    onCancel,
    isLoading = false,
  }: FriendRequestCardProps) => {
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
          <ActionButton
            onClick={() => onCancel(user.id)}
            disabled={isLoading}
            loading={isLoading}
            variant="secondary"
            fullWidth
            className="gap-2"
          >
            <UserX className="h-4 w-4" />
            Cancel
          </ActionButton>
        ) : (
          <ActionButton
            onClick={() => onSend(user.id)}
            disabled={isLoading}
            loading={isLoading}
            variant="primary"
            fullWidth
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Send
          </ActionButton>
        )}
      </div>
    );
  }
);
