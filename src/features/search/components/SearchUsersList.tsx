import { UserAvatar } from '@/shared/components/UserAvatar';
import { ActionButton } from '@/shared/components/ActionButton';
import type { SearchUser } from '../types/search.type';

interface SearchUsersListProps {
  users: SearchUser[];
  onViewProfile: (userId: string) => void;
}

export const SearchUsersList = ({
  users,
  onViewProfile,
}: SearchUsersListProps) => {
  if (!users.length) {
    return (
      <div className="text-muted-foreground py-10 text-center">
        No users found.
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border bg-blue-50 p-3 transition-colors"
          >
            <div className="flex items-center gap-4">
              <UserAvatar
                name={user.name}
                avatar={user.avatarUrl}
                className="h-12 w-12 border"
              />
              <div>
                <h4 className="text-[15px] font-semibold">{user.name}</h4>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>
            <ActionButton
              type="button"
              variant="secondary"
              className="rounded-full bg-white px-5 py-2 text-sm"
              onClick={() => onViewProfile(user.id)}
            >
              View profile
            </ActionButton>
          </div>
        ))}
      </div>
    </div>
  );
};
