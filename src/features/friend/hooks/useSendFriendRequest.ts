import { useEffect, useState } from 'react';
import { friendApi } from '@/features/friend/services/friend.api';
import type { Friend } from '@/features/friend/types/friends.type';

type SuggestionStatus = 'idle' | 'pending';

interface FriendSuggestion {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  status: SuggestionStatus;
  friendshipId?: string;
}

interface ApiUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export function useFriendRequests(userId: string | null) {
  const [requests, setRequests] = useState<FriendSuggestion[]>([]);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const usersRes = await friendApi.getAllUsers();
        const allUsers = (
          Array.isArray(usersRes)
            ? usersRes
            : (usersRes as { data: ApiUser[] }).data || []
        ) as ApiUser[];

        const friendsRes = await friendApi.getFriends(Number(userId));
        const friends: Friend[] = friendsRes.data ?? [];

        const friendUserIds = new Set(friends.map((f) => f.friend.id));

        const suggestions: FriendSuggestion[] = allUsers
          .filter((u) => u.id !== userId && !friendUserIds.has(u.id))
          .map((u) => ({
            user: {
              id: u.id,
              name: u.name,
              avatarUrl: u.avatarUrl,
            },
            status: 'idle',
          }));

        setRequests(suggestions);
      } catch (error) {
        console.error('Lỗi fetchSuggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId]);

  const toggleRequest = async (
    targetUserId: string,
    nextStatus: SuggestionStatus
  ) => {
    if (processingIds.includes(targetUserId)) return;
    setProcessingIds((p) => [...p, targetUserId]);

    try {
      if (nextStatus === 'pending') {
        const res = await friendApi.sendFriendRequest({
          friendId: targetUserId,
        });

        const resData = res.data as unknown as
          | { id?: string; friendId?: string }
          | undefined;
        const friendshipId = resData?.id || resData?.friendId;

        setRequests((prev) =>
          prev.map((r) =>
            r.user.id === targetUserId
              ? { ...r, status: 'pending', friendshipId: friendshipId }
              : r
          )
        );
      } else {
        const target = requests.find((r) => r.user.id === targetUserId);
        const idToDelete = target?.friendshipId || targetUserId;

        await friendApi.updateFriendStatus(idToDelete, 'block');

        setRequests((prev) =>
          prev.map((r) =>
            r.user.id === targetUserId
              ? { ...r, status: 'idle', friendshipId: undefined }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Lỗi toggleRequest:', error);
    } finally {
      setProcessingIds((p) => p.filter((id) => id !== targetUserId));
    }
  };

  return {
    requests,
    sendingIds: processingIds,
    toggleRequest,
    loading,
  };
}
