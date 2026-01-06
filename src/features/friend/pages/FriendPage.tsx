'use client';

import { useState } from 'react';
import { useFriendList } from '@/features/friend/hooks/useFriendList';
import { useFriendRequests } from '@/features/friend/hooks/useSendFriendRequest';
import { IncomingRequestCard } from '@/features/friend/components/FriendIncomingRequestCard';
import { FriendListCard } from '@/features/friend/components/FriendListCard';
import { FriendRequestCard } from '@/features/friend/components/FriendRequestCard';
import { useFriendActions } from '@/features/friend/hooks/useFriendAction';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const currentUserId = getCookie('userId') ?? '';
const currentUserName = getCookie('userName') ?? '';
const currentUserAvatar = getCookie('userAvatar') ?? '';

export default function FriendsPage() {
  const [userId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  });

  const {
    incomingRequests,
    isLoading: isIncomingLoading,
    actionId,
    handleAccept,
    handleReject,
  } = useFriendActions();

  const {
    friends,
    loading: friendsLoading,
    removingIds,
    block,
    fetchFriends,
    unfriend,
  } = useFriendList();

  const onAcceptAndRefresh = async (id: string) => {
    try {
      await handleAccept(id);
      await Promise.all([fetchFriends()]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Accept failed', err);
    }
  };

  const { requests, sendingIds, toggleRequest } = useFriendRequests(userId);

  return (
    <>
      <div className="border-border mx-auto mb-5 max-w-6xl rounded-lg border p-6">
        <h2 className="mb-4 text-[20px] font-semibold">Friend requests</h2>

        {isIncomingLoading && (
          <p className="text-muted-foreground">Loading friend requests...</p>
        )}

        {!isIncomingLoading && incomingRequests.length === 0 && (
          <p className="text-muted-foreground">No pending friend requests.</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {incomingRequests.map((req) => (
            <IncomingRequestCard
              key={req.id}
              request={req}
              onAccept={onAcceptAndRefresh}
              onReject={handleReject}
              isProcessing={actionId === req.requester.id}
            />
          ))}
        </div>
      </div>

      <div className="border-border mx-auto mb-5 max-w-6xl rounded-lg border p-6">
        <h2 className="mb-4 text-[20px] font-semibold">List my friends</h2>

        {friendsLoading && (
          <p className="text-muted-foreground">Loading friends...</p>
        )}

        {!friendsLoading && friends.length === 0 && (
          <p className="text-muted-foreground">You have no friends yet.</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <FriendListCard
              key={friend.friendId}
              friend={friend}
              onRemove={(id, status) => block(id, status)}
              onUnfriend={unfriend}
              isLoading={removingIds.includes(friend.friendId)}
            />
          ))}
        </div>
      </div>

      <div className="border-border mx-auto max-w-6xl rounded-lg border p-6">
        <h2 className="mb-4 text-[20px] font-semibold">People You May Know</h2>

        {requests.length === 0 && (
          <p className="text-muted-foreground">
            No friend suggestions available.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((r, index) => (
            <FriendRequestCard
              key={r.friendshipId ?? `${r.user.id}-${r.status}-${index}`}
              request={{
                id: r.friendshipId ?? r.user.id,
                requester: {
                  id: currentUserId,
                  name: currentUserName,
                  avatarUrl: currentUserAvatar,
                },
                addressee: r.user,
                status: r.status as 'pending' | 'idle',
                createdAt: '',
              }}
              onAction={toggleRequest}
              isLoading={sendingIds.includes(r.user.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
