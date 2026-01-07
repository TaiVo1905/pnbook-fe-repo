import { useEffect, useState, useCallback, useRef } from 'react';
import { friendApi } from '@/features/friend/services/friend.api';
import type {
  UserInfo,
  FriendRequest,
  FriendRequestStatus,
} from '@/features/friend/types/friends.type';
import { toast } from 'sonner';

interface FriendSuggestion {
  user: UserInfo;
  status: Extract<FriendRequestStatus, 'idle' | 'pending'>;
  friendshipId?: string;
}

const buildSuggestion = (
  user: UserInfo,
  friendshipId?: string
): FriendSuggestion => ({
  user,
  status: friendshipId ? 'pending' : 'idle',
  friendshipId,
});

export function useFriendRequests(currentUserId: string | null) {
  const [requests, setRequests] = useState<FriendSuggestion[]>([]);
  const [baseRequests, setBaseRequests] = useState<FriendSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const sentPendingMapRef = useRef<Map<string, string>>(new Map());
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const [usersRes, sentRes] = await Promise.all([
          friendApi.getAllUsers(),
          friendApi.getSentFriendRequests(currentUserId),
        ]);
        const users: UserInfo[] = usersRes ?? [];
        const sentRequests: FriendRequest[] = sentRes.data ?? [];

        const sentMap = new Map<string, string>();
        sentRequests.forEach((r) => {
          if (r.status === 'pending') {
            sentMap.set(r.addressee.id, r.id);
          }
        });
        sentPendingMapRef.current = sentMap;

        const formatted = users
          .filter((u) => u.id !== currentUserId)
          .map((u) => {
            const sentId = sentMap.get(u.id);
            return sentId ? buildSuggestion(u, sentId) : buildSuggestion(u);
          });

        setBaseRequests(formatted);
        setRequests(formatted);
      } catch (e) {
        console.error('Fetch suggestions failed', e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [currentUserId]);

  const handleSearch = useCallback(
    (value: string) => {
      const keyword = value.trim();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (!keyword) {
        setRequests(baseRequests);
        return;
      }
      searchTimeoutRef.current = window.setTimeout(async () => {
        setLoading(true);
        try {
          const res = await friendApi.searchUsers(keyword);
          const users: UserInfo[] = res.data ?? [];

          const formatted = users
            .filter((u) => u.id !== currentUserId)
            .map((u) => {
              const existing = baseRequests.find((r) => r.user.id === u.id);
              if (existing) return existing;
              const sentId = sentPendingMapRef.current.get(u.id);
              return sentId ? buildSuggestion(u, sentId) : buildSuggestion(u);
            });

          setRequests(formatted);
        } catch (e) {
          console.error('Search error', e);
        } finally {
          setLoading(false);
        }
      }, 500);
    },
    [baseRequests, currentUserId]
  );

  const toggleRequest = useCallback(
    async (targetUserId: string) => {
      if (processingIds.includes(targetUserId)) return;
      setProcessingIds((p) => [...p, targetUserId]);
      try {
        if (sentPendingMapRef.current.has(targetUserId)) {
          toast.info('You already sent a friend request to this user.');
          setProcessingIds((p) => p.filter((id) => id !== targetUserId));
          return;
        }
        const res = await friendApi.sendFriendRequest(targetUserId);
        const friendshipId = res.data?.id;
        if (!friendshipId) return;
        toast.success('Friend request sent!');
        sentPendingMapRef.current.set(targetUserId, friendshipId);

        const updater = (r: FriendSuggestion): FriendSuggestion =>
          r.user.id === targetUserId
            ? { ...r, status: 'pending', friendshipId }
            : r;

        setRequests((prev) => prev.map(updater));
        setBaseRequests((prev) => prev.map(updater));
      } catch (e: unknown) {
        const err = e as { response?: { status?: number } };
        if (err?.response?.status === 409 || err?.response?.status === 500) {
          toast.info('Friend request already exists.');
        } else {
          toast.error('Failed to send friend request.');
        }
      } finally {
        setProcessingIds((p) => p.filter((id) => id !== targetUserId));
      }
    },
    [processingIds]
  );

  const isRequestDisabled = (targetUserId: string) =>
    processingIds.includes(targetUserId) ||
    sentPendingMapRef.current.has(targetUserId);

  return {
    requests,
    loading,
    sendingIds: processingIds,
    handleSearch,
    toggleRequest,
    isRequestDisabled,
  };
}
