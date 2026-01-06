import { Button } from '@/core/shadcn/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/core/shadcn/components/ui/avatar';
import { Loader2, Check, X } from 'lucide-react';
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
        <Avatar>
          <AvatarImage src={requester.avatarUrl} />
          <AvatarFallback>{requester.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{requester.name}</p>
          <p className="text-muted-foreground text-xs">Want to connect</p>
        </div>
      </div>

      <div className="mt-4 flex w-full items-center justify-center gap-3">
        <Button
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => onAccept(requester.id)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-1 h-4 w-2" />
          )}
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs"
          onClick={() => onReject(requester.id)}
          disabled={isProcessing}
        >
          <X className="mr-1 h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>
  );
}
