import { useCallback, useEffect, useRef, useState } from 'react';
import { friendApi } from '@/features/friend/services/friend.api';
import type {
  UserInfo,
  FriendRequest,
} from '@/features/friend/types/friends.type';
import {
  createFriendSuggestion,
  type FriendSuggestion,
} from '@/features/friend/utils/friend.util';
import { toast } from 'sonner';

export function useFriendSuggestions(currentUserId: string | null) {
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
  const [baseSuggestions, setBaseSuggestions] = useState<FriendSuggestion[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [sendingIds, setSendingIds] = useState<string[]>([]);

  const sentPendingMapRef = useRef<Set<string>>(new Set());
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchInitial = async () => {
      setLoading(true);
      try {
        const [suggestionsRes, sentRes] = await Promise.all([
          friendApi.getFriendSuggestions(),
          friendApi.getSentFriendRequests(),
        ]);

        const users: UserInfo[] = suggestionsRes.data ?? [];
        const sentRequests: FriendRequest[] = sentRes.data ?? [];

        const sentAddresseeIds = new Set<string>();
        sentRequests.forEach((r) => {
          if (r.status === 'pending') {
            sentAddresseeIds.add(r.addresseeId);
          }
        });
        sentPendingMapRef.current = sentAddresseeIds;

        const formatted = users
          .filter((u) => u.id !== currentUserId)
          .map((u) => createFriendSuggestion(u, sentAddresseeIds.has(u.id)));

        setBaseSuggestions(formatted);
        setSuggestions(formatted);
      } catch (e) {
        console.error('Fetch suggestions failed', e);
        toast.error('Failed to load suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [currentUserId]);

  const handleSearch = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim();

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!trimmed) {
        setSuggestions(baseSuggestions);
        return;
      }

      searchTimeoutRef.current = window.setTimeout(async () => {
        setLoading(true);
        try {
          const res = await friendApi.searchUsers(trimmed);
          const users: UserInfo[] = res.data ?? [];

          const formatted = users
            .filter((u) => u.id !== currentUserId)
            .map((u) => {
              const existing = baseSuggestions.find((s) => s.user.id === u.id);
              if (existing) return existing;
              const isPending = (sentPendingMapRef.current as Set<string>).has(
                u.id
              );
              return createFriendSuggestion(u, isPending);
            });

          setSuggestions(formatted);
        } catch (e) {
          console.error('Search error', e);
          toast.error('Search failed');
        } finally {
          setLoading(false);
        }
      }, 500);
    },
    [baseSuggestions, currentUserId]
  );

  const sendRequest = useCallback(
    async (targetUserId: string) => {
      if (sendingIds.includes(targetUserId)) return false;

      const sentAddresseeIds = sentPendingMapRef.current as Set<string>;
      if (sentAddresseeIds.has(targetUserId)) {
        toast.info('Friend request already sent');
        return false;
      }

      setSendingIds((p) => [...p, targetUserId]);

      try {
        const res = await friendApi.sendFriendRequest(targetUserId);

        if (res.statusCode !== 201 || !res.data) {
          toast.error('Failed to send request');
          return false;
        }

        toast.success('Friend request sent!');
        sentAddresseeIds.add(targetUserId);

        const updater = (s: FriendSuggestion): FriendSuggestion =>
          s.user.id === targetUserId ? { ...s, status: 'pending' } : s;

        setSuggestions((prev) => prev.map(updater));
        setBaseSuggestions((prev) => prev.map(updater));

        return true;
      } catch (e: unknown) {
        const err = e as { response?: { status?: number } };
        if (err?.response?.status === 409 || err?.response?.status === 500) {
          toast.info('Friend request already exists');
        } else {
          toast.error('Failed to send friend request');
        }
        return false;
      } finally {
        setSendingIds((p) => p.filter((id) => id !== targetUserId));
      }
    },
    [sendingIds]
  );

  const isRequestDisabled = (targetUserId: string) =>
    sendingIds.includes(targetUserId) ||
    (sentPendingMapRef.current as Set<string>).has(targetUserId);

  return {
    suggestions,
    loading,
    sendingIds,
    handleSearch,
    sendRequest,
    isRequestDisabled,
  };
}
