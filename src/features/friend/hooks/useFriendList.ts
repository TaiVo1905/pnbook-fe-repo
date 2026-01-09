import { useEffect, useState } from 'react';
import type { Friend } from '@/features/friend/types/friends.type';
import { friendApi } from '@/features/friend/services/friend.api';
import { toast } from 'sonner';

export function useFriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await friendApi.getFriends();
      setFriends(res.data ?? []);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleToggleBlock = async (
    id: string,
    newStatus: 'accepted' | 'block'
  ) => {
    if (removingIds.includes(id)) return;
    setRemovingIds((p) => [...p, id]);

    try {
      await friendApi.updateFriendStatus(id, newStatus);
      toast.success(newStatus === 'block' ? 'Blocked!' : 'Unblocked!');

      await fetchFriends();
    } catch (error) {
      console.error('Failed to update friend status:', error);
    } finally {
      setRemovingIds((p) => p.filter((item) => item !== id));
    }
  };

  const handleUnfriend = async (id: string) => {
    if (removingIds.includes(id)) return;

    if (!window.confirm('Do you want to unfriend this person?')) return;

    setRemovingIds((p) => [...p, id]);

    try {
      await friendApi.unFriend(id);
      toast.success('Unfriended successfully!');

      await fetchFriends();
    } catch (error) {
      console.error('Failed to unfriend:', error);
      toast.error('Unfriend failed!');
    } finally {
      setRemovingIds((p) => p.filter((item) => item !== id));
    }
  };

  return {
    friends,
    loading,
    removingIds,
    block: (id: string, status: 'accepted' | 'block') =>
      handleToggleBlock(id, status),
    unfriend: handleUnfriend,
    fetchFriends,
  };
}
