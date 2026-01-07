import { useFriendList } from '@/features/friend/hooks/useFriendList';
import { useFriendRequests } from '@/features/friend/hooks/useSendFriendRequest';
import { IncomingRequestCard } from '@/features/friend/components/FriendIncomingRequestCard';
import { FriendListCard } from '@/features/friend/components/FriendListCard';
import { FriendSuggestionCard } from '@/features/friend/components/FriendRequestCard';
import { useFriendActions } from '@/features/friend/hooks/useFriendAction';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function FriendsPage() {
  const currentUserId = getCookie('userId') ?? null;
  const _currentUserName = getCookie('userName') ?? '';
  const _currentUserAvatar = getCookie('userAvatar') ?? '';

  const { incomingRequests, actionId, handleAccept, handleReject } =
    useFriendActions();

  const { friends, removingIds, block, fetchFriends, unfriend } =
    useFriendList();

  const onAcceptAndRefresh = async (id: string) => {
    try {
      await handleAccept(id);
      await fetchFriends();
    } catch (err) {
      console.error('Accept failed', err);
    }
  };

  const { requests, sendingIds, toggleRequest, handleSearch } =
    useFriendRequests(currentUserId);

  const columnStyle =
    'w-[32%] h-[85vh] mx-[0.6%] border border-border rounded-lg p-6 bg-card flex flex-col overflow-hidden';

  return (
    <div className="flex w-full justify-center overflow-hidden p-4">
      <div className={columnStyle}>
        <h2 className="mb-4 shrink-0 border-b pb-2 text-[19px] font-semibold">
          Friend requests
        </h2>
        <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
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

      <div className={columnStyle}>
        <h2 className="mb-4 shrink-0 border-b pb-2 text-[19px] font-semibold">
          List my friends
        </h2>
        <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
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

      <div className={columnStyle}>
        <div className="shrink-0">
          <h2 className="mb-4 border-b pb-2 text-[19px] font-semibold">
            Suggestions
          </h2>
          <input
            type="text"
            placeholder="Type a name..."
            className="mb-4 w-full rounded border p-2"
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          />
        </div>
        <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
          {requests.map((r) => (
            <FriendSuggestionCard
              key={r.user.id}
              suggestion={r}
              onToggle={toggleRequest}
              isLoading={sendingIds.includes(r.user.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
