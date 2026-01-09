import { useCallback, useEffect, useState } from 'react';
import { friendApi } from '@/features/friend/services/friend.api';
import type {
  FriendRequest,
  UserInfo,
} from '@/features/friend/types/friends.type';
import { toast } from 'sonner';

interface IncomingRequest {
  request: FriendRequest;
  isProcessing: boolean;
}

interface UseIncomingRequestsOptions {
  onAcceptSuccess?: (user: UserInfo) => void;
}

export function useIncomingRequests(
  currentUserId: string | null,
  options?: UseIncomingRequestsOptions
) {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await friendApi.getIncomingRequests();
        const requestsList: FriendRequest[] = res.data ?? [];

        const formatted = requestsList.map((r) => ({
          request: r,
          isProcessing: false,
        }));

        setRequests(formatted);
      } catch (e) {
        console.error('Fetch incoming requests failed', e);
        toast.error('Failed to load friend requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  const accept = useCallback(
    async (requesterId: string) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.request.requesterId === requesterId
            ? { ...r, isProcessing: true }
            : r
        )
      );

      try {
        await friendApi.acceptRequest(requesterId);
        toast.success('Friend request accepted!');

        const acceptedRequest = requests.find(
          (r) => r.request.requesterId === requesterId
        );
        if (acceptedRequest && options?.onAcceptSuccess) {
          options.onAcceptSuccess(acceptedRequest.request.requester);
        }

        setRequests((prev) =>
          prev.filter((r) => r.request.requesterId !== requesterId)
        );
      } catch (e) {
        console.error('Accept request failed', e);
        toast.error('Failed to accept request');
        setRequests((prev) =>
          prev.map((r) =>
            r.request.requesterId === requesterId
              ? { ...r, isProcessing: false }
              : r
          )
        );
      }
    },
    [requests, options]
  );

  const reject = useCallback(async (requesterId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.request.requesterId === requesterId ? { ...r, isProcessing: true } : r
      )
    );

    try {
      await friendApi.rejectRequest(requesterId);
      toast.success('Friend request rejected');
      setRequests((prev) =>
        prev.filter((r) => r.request.requesterId !== requesterId)
      );
    } catch (e) {
      console.error('Reject request failed', e);
      toast.error('Failed to reject request');
      setRequests((prev) =>
        prev.map((r) =>
          r.request.requesterId === requesterId
            ? { ...r, isProcessing: false }
            : r
        )
      );
    }
  }, []);

  return {
    requests,
    loading,
    accept,
    reject,
  };
}
