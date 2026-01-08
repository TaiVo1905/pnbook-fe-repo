import { UserAvatar } from '@/shared/components/UserAvatar';
import { ActionButton } from '@/shared/components/ActionButton';
import type { UserWithFriendStatus } from '../types/profile.type';

const DEFAULT_COVER_URL =
  'https://www.pixelstalk.net/wp-content/uploads/2016/09/Free-Download-Album-Cover-Background-.jpg';

interface ProfileHeaderProps {
  user: UserWithFriendStatus;
  isOwnProfile: boolean;
  onEditProfile: () => void;
  onSendFriendRequest: () => void;
  onCancelFriendRequest: () => void;
  onUnfriend: () => void;
  onAcceptFriendRequest?: () => void;
  onRejectFriendRequest?: () => void;
  isRequestLoading: boolean;
  onAvatarClick: () => void;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  onEditProfile,
  onSendFriendRequest,
  onCancelFriendRequest,
  onUnfriend,
  onAcceptFriendRequest,
  onRejectFriendRequest,
  isRequestLoading,
  onAvatarClick,
}: ProfileHeaderProps) => {
  return (
    <div className="to-background bg-gradient-to-b from-black/10">
      <div className="relative h-64 overflow-hidden">
        <img
          src={user.coverUrl || DEFAULT_COVER_URL}
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="relative mx-auto -mt-20 max-w-5xl px-4 sm:px-6">
        <div className="bg-card/80 rounded-2xl border p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              <div
                className={`${isOwnProfile ? 'cursor-pointer' : ''} border-background -mt-12 h-32 w-32 overflow-hidden rounded-full border-4 shadow-lg sm:-mt-16 sm:h-40 sm:w-40`}
                onClick={onAvatarClick}
              >
                <UserAvatar
                  name={user.name}
                  avatar={user.avatarUrl}
                  className="h-full w-full"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isOwnProfile ? (
                    <ActionButton onClick={onEditProfile} variant="primary">
                      Edit Profile
                    </ActionButton>
                  ) : (
                    <>
                      {user.friendshipStatus === 'none' && (
                        <ActionButton
                          onClick={onSendFriendRequest}
                          loading={isRequestLoading}
                          variant="primary"
                        >
                          Add Friend
                        </ActionButton>
                      )}
                      {user.friendshipStatus === 'pending' &&
                        user.requestSentByMe && (
                          <ActionButton
                            onClick={onCancelFriendRequest}
                            loading={isRequestLoading}
                            variant="secondary"
                          >
                            Cancel Request
                          </ActionButton>
                        )}
                      {user.friendshipStatus === 'pending' &&
                        !user.requestSentByMe &&
                        user.requestReceivedFromThem && (
                          <>
                            <ActionButton
                              onClick={onAcceptFriendRequest}
                              loading={isRequestLoading}
                              variant="primary"
                            >
                              Accept Request
                            </ActionButton>
                            <ActionButton
                              onClick={onRejectFriendRequest}
                              loading={isRequestLoading}
                              variant="secondary"
                            >
                              Reject
                            </ActionButton>
                          </>
                        )}
                      {user.isFriend && (
                        <ActionButton
                          onClick={onUnfriend}
                          loading={isRequestLoading}
                          variant="secondary"
                        >
                          Unfriend
                        </ActionButton>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
