import { useCallback, useEffect, useState } from 'react';
import { friendApi } from '@/features/friend/services/friend.api';
import type { UserInfo, Friend } from '@/features/friend/types/friends.type';
import { toast } from 'sonner';

interface FriendItem {
  user: UserInfo;
  isBlocked: boolean;
  isUnfriending: boolean;
}

export function useFriendsList(currentUserId: string | null) {
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchFriends = async () => {
      setLoading(true);
      try {
        const res = await friendApi.getFriends();
        const friendsList: Friend[] = res.data ?? [];

        const formatted = friendsList.map((f) => ({
          user: f.friend,
          isBlocked: f.status === 'block',
          isUnfriending: false,
        }));

        setFriends(formatted);
      } catch (e) {
        console.error('Fetch friends failed', e);
        toast.error('Failed to load friends');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUserId]);

  const toggleBlock = useCallback(
    async (friendshipId: string, shouldBlock: boolean) => {
      try {
        const newStatus = shouldBlock ? 'block' : 'accepted';
        await friendApi.updateFriendStatus(friendshipId, newStatus);
        toast.success(shouldBlock ? 'Friend blocked' : 'Friend unblocked');

        setFriends((prev) =>
          prev.map((f) =>
            f.user.id === friendshipId ? { ...f, isBlocked: shouldBlock } : f
          )
        );

        setBlockedIds((prev) =>
          shouldBlock
            ? [...prev, friendshipId]
            : prev.filter((id) => id !== friendshipId)
        );
      } catch (e) {
        console.error('Block action failed', e);
        toast.error(
          shouldBlock ? 'Failed to block friend' : 'Failed to unblock friend'
        );
      }
    },
    []
  );

  const unfriend = useCallback(async (friendshipId: string) => {
    setFriends((prev) =>
      prev.map((f) =>
        f.user.id === friendshipId ? { ...f, isUnfriending: true } : f
      )
    );

    try {
      await friendApi.unFriend(friendshipId);
      toast.success('Friend removed');
      setFriends((prev) => prev.filter((f) => f.user.id !== friendshipId));
    } catch (e) {
      console.error('Unfriend failed', e);
      toast.error('Failed to remove friend');
      setFriends((prev) =>
        prev.map((f) =>
          f.user.id === friendshipId ? { ...f, isUnfriending: false } : f
        )
      );
    }
  }, []);

  const addFriend = useCallback((user: UserInfo) => {
    setFriends((prev) => [
      {
        user,
        isBlocked: false,
        isUnfriending: false,
      },
      ...prev,
    ]);
  }, []);

  return {
    friends,
    loading,
    blockedIds,
    toggleBlock,
    unfriend,
    addFriend,
  };
}
