import { useFriendsList } from '@/features/friend/hooks/useFriendsList';
import { useFriendSuggestions } from '@/features/friend/hooks/useFriendSuggestions';
import { useIncomingRequests } from '@/features/friend/hooks/useIncomingRequests';
import { IncomingRequestCard } from '@/features/friend/components/FriendIncomingRequestCard';
import { FriendListCard } from '@/features/friend/components/FriendListCard';
import { FriendSuggestionCard } from '@/features/friend/components/FriendSuggestionCard';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

export default function FriendsPage() {
  const { currentUserId } = useCurrentUser();

  const { friends, toggleBlock, unfriend, addFriend } = useFriendsList(
    currentUserId ?? null
  );

  const {
    requests: incomingRequests,
    accept,
    reject,
  } = useIncomingRequests(currentUserId ?? null, {
    onAcceptSuccess: addFriend,
  });

  const { suggestions, handleSearch, sendRequest, sendingIds } =
    useFriendSuggestions(currentUserId ?? null);

  const columnStyle =
    'w-[32%] h-[80vh] mx-[0.6%] border border-border rounded-lg p-6 bg-card flex flex-col overflow-hidden';

  return (
    <div className="flex w-full justify-center overflow-hidden p-4">
      <div className={columnStyle}>
        <h2 className="mb-4 shrink-0 border-b pb-2 text-[19px] font-semibold">
          Friend requests
        </h2>
        <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
          {incomingRequests.map((item) => (
            <IncomingRequestCard
              key={item.request.id}
              request={item.request}
              onAccept={accept}
              onReject={reject}
              isProcessing={item.isProcessing}
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
              key={friend.user.id}
              friend={friend.user}
              onRemove={(id, shouldBlock) => toggleBlock(id, shouldBlock)}
              onUnfriend={unfriend}
              isLoading={friend.isUnfriending}
              isBlocked={friend.isBlocked}
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
          {suggestions.map((suggestion) => (
            <FriendSuggestionCard
              key={suggestion.user.id}
              suggestion={suggestion}
              onToggle={sendRequest}
              isLoading={sendingIds.includes(suggestion.user.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
