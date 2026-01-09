import { Button } from '@/core/shadcn/components/ui/button';
import { Loader2, Check, X } from 'lucide-react';
import { UserAvatar } from '@/shared/components/UserAvatar';
import type { FriendRequest } from '@/features/friend/types/friends.type';

interface Props {
  request: FriendRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: boolean;
}

export function IncomingRequestCard({
  request,
  onAccept,
  onReject,
  isProcessing,
}: Props) {
  const { requester } = request;

  return (
    <div className="bg-card flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <UserAvatar
          avatar={requester.avatarUrl}
          name={requester.name}
          size="md"
        />
        <div>
          <p className="text-sm font-medium">{requester.name}</p>
          <p className="text-muted-foreground text-xs">Wants to connect</p>
        </div>
      </div>

      <div className="mt-1 grid w-full grid-cols-2 gap-3">
        <Button
          size="sm"
          className="h-8 cursor-pointer border-none bg-emerald-500 px-3 text-sm text-white shadow-none transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200/50"
          onClick={() => onAccept(request.requesterId)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-1 h-4 w-4" />
          )}
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 cursor-pointer border-red-200 bg-transparent px-3 text-sm text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={() => onReject(request.requesterId)}
          disabled={isProcessing}
        >
          <X className="mr-1 h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>
  );
}
