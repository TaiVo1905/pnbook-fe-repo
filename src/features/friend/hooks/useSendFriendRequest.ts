import { useEffect, useState } from 'react';
import type { FriendRequest } from '@/features/friend/types/friends.type';
import {
  getFriendSuggestions,
  postSendFriendRequest,
} from '@/features/friend/services/friend.api';

export function useFriendSuggestions() {
  const [suggestions, setSuggestions] = useState<FriendRequest[]>([]);
  const [sendingIds, setSendingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      const res = await getFriendSuggestions();
      if (Array.isArray(res.data)) {
        setSuggestions(res.data);
      } else {
        setSuggestions([]);
      }
      setLoading(false);
    };
    fetchSuggestions();
  }, []);

  const SendFriendRequest = async (friendId: string) => {
    if (sendingIds.includes(friendId)) return;
    setSendingIds((prev) => [...prev, friendId]);

    try {
      const res = await postSendFriendRequest({ friendId });
      if (res.statusCode === 200 && res.statusCode < 300) {
        setSuggestions((prev) =>
          prev.map((s) => (s.id === friendId ? { ...s, isRequested: true } : s))
        );
      }
    } finally {
      setSendingIds((prev) => prev.filter((id) => id !== friendId));
    }
  };

  const cancelFriendRequest = async (friendId: string) => {
    if (sendingIds.includes(friendId)) return;
    setSendingIds((prev) => [...prev, friendId]);

    try {
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === friendId ? { ...s, isRequested: 'cancelled' } : s
        )
      );
    } finally {
      setSendingIds((prev) => prev.filter((id) => id !== friendId));
    }
  };

  return {
    suggestions,
    sendingIds,
    loading,
    sendFriendRequest: SendFriendRequest,
    cancelFriendRequest,
  };
}
