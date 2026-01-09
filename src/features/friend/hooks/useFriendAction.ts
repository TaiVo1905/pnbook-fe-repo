import { useState, useEffect } from 'react';
import { friendApi } from '@/features/friend/services/friend.api';
import type { FriendRequest } from '@/features/friend/types/friends.type';
import { toast } from 'sonner';

export function useFriendActions() {
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await friendApi.getIncomingRequests();
      setIncomingRequests(res.data ?? []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requesterId: string) => {
    setActionId(requesterId);
    try {
      await friendApi.acceptRequest(requesterId);
      toast.success('Friend request accepted!');
      setIncomingRequests((prev) =>
        prev.filter((r) => r.requester.id !== requesterId)
      );
    } catch {
      toast.error('Failed to accept friend request. Please try again!');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (requesterId: string) => {
    setActionId(requesterId);
    try {
      await friendApi.rejectRequest(requesterId);
      toast.info('Rejected request.');
      setIncomingRequests((prev) =>
        prev.filter((r) => r.requester.id !== requesterId)
      );
    } catch {
      toast.error('Failed to reject request!');
    } finally {
      setActionId(null);
    }
  };

  return {
    incomingRequests,
    isLoading,
    actionId,
    handleAccept,
    handleReject,
    refresh: fetchRequests,
  };
}
