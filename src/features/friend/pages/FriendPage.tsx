import { useFriendSuggestions } from '@/features/friend/hooks/useSendFriendRequest';
import { FriendRequestCard } from '@/features/friend/components/FriendRequestCard';

const FriendsPage = () => {
  const {
    suggestions,
    sendFriendRequest,
    cancelFriendRequest,
    sendingIds,
    loading,
  } = useFriendSuggestions();

  return (
    <div className="border-border mx-auto max-w-4xl space-y-6 rounded-lg border p-6">
      <h1 className="text-1xl font-bold">Friends Suggestions</h1>

      {loading && <p>Loading friend suggestions...</p>}

      {!loading && suggestions.length === 0 && (
        <p className="text-muted-foreground">
          There are currently no friend suggestions.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {suggestions.map((s) => (
          <FriendRequestCard
            key={s.id}
            request={s}
            onSend={sendFriendRequest}
            onCancel={cancelFriendRequest}
            isLoading={sendingIds.includes(s.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendsPage;
