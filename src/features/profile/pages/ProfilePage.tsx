import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { profileApi } from '../services/profile.api';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { userApi } from '@/core/api/user.api';
import { useUserProfilePosts } from '../hooks/useUserProfilePosts';
import { CreatePostModal } from '@/shared/modals/CreatePostModal';
import { EditProfileModal } from '../components/EditProfileModal';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostsTab } from '../components/PostsTab';
import type { UserWithFriendStatus } from '../types/profile.type';

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUserId } = useCurrentUser();

  const [user, setUser] = useState<UserWithFriendStatus | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const targetUserId = userId || currentUserId;
  const isOwnProfile = !userId || userId === currentUserId;

  const {
    posts,
    isLoading: isLoadingPosts,
    isFetchingMore,
    resetAndFetch,
    scrollContainerRef,
  } = useUserProfilePosts(targetUserId);

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) return;
    try {
      if (isOwnProfile) {
        const me = await userApi.getCurrentUser();
        if (me.data) {
          const normalizedUser: UserWithFriendStatus = {
            id: me.data.id,
            name: me.data.name,
            email: me.data.email,
            avatarUrl: me.data.avatarUrl,
            coverUrl: undefined,
            bio: undefined,
            createdAt: new Date().toISOString(),
            friendshipStatus: 'none',
            isFriend: false,
            requestSentByMe: false,
          };
          setUser(normalizedUser);
        }
      } else {
        const res = await profileApi.getUserProfile(targetUserId);
        if (res.data) {
          const rel = res.data.relationshipStatus;
          const isFriend = rel?.isFriend ?? false;
          const sent = rel?.sentFriendRequest ?? false;
          const received = rel?.receivedFriendRequest ?? false;
          const friendshipStatus: 'none' | 'pending' | 'accepted' = isFriend
            ? 'accepted'
            : sent || received
              ? 'pending'
              : 'none';

          const normalizedUser: UserWithFriendStatus = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            avatarUrl: res.data.avatarUrl,
            coverUrl: res.data.coverUrl,
            bio: res.data.bio,
            createdAt: res.data.createdAt,
            friendshipStatus,
            isFriend,
            requestSentByMe: received || false,
            requestReceivedFromThem: sent || false,
          };
          setUser(normalizedUser);
        } else {
          toast.error(res.message || 'Failed to fetch profile');
        }
      }
    } catch {
      toast.error('Failed to fetch profile');
    } finally {
      setIsLoadingProfile(false);
    }
  }, [targetUserId, isOwnProfile]);

  useEffect(() => {
    setIsLoadingProfile(true);
    setUser(null);
    fetchProfile();
  }, [targetUserId, fetchProfile]);

  useEffect(() => {
    resetAndFetch();
  }, [targetUserId, resetAndFetch]);

  const handleSendFriendRequest = async () => {
    if (!user) return;
    setIsRequestLoading(true);
    try {
      const res = await profileApi.sendFriendRequest(user.id);
      if (res.statusCode === 201) {
        toast.success('Friend request sent');
        setUser({
          ...user,
          friendshipStatus: 'pending',
          requestSentByMe: true,
          requestReceivedFromThem: false,
        });
      } else {
        toast.error(res.message || 'Failed to send friend request');
      }
    } catch {
      toast.error('Failed to send friend request');
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleCancelFriendRequest = async () => {
    if (!user) return;
    setIsRequestLoading(true);
    try {
      const res = await profileApi.cancelFriendRequest(user.id);
      if (res.statusCode === 200) {
        toast.success('Friend request cancelled');
        setUser({ ...user, friendshipStatus: 'none', requestSentByMe: false });
      } else {
        toast.error(res.message || 'Failed to cancel friend request');
      }
    } catch {
      toast.error('Failed to cancel friend request');
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!user) return;
    setIsRequestLoading(true);
    try {
      const res = await profileApi.unfriend(user.id);
      if (res.statusCode === 200) {
        toast.success('Friend removed');
        setUser({ ...user, friendshipStatus: 'none', isFriend: false });
      } else {
        toast.error(res.message || 'Failed to remove friend');
      }
    } catch {
      toast.error('Failed to remove friend');
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!user) return;
    setIsRequestLoading(true);
    try {
      const res = await profileApi.acceptFriendRequest(user.id);
      if (res.statusCode === 200) {
        toast.success('Friend request accepted');
        setUser({
          ...user,
          friendshipStatus: 'accepted',
          isFriend: true,
          requestReceivedFromThem: false,
        });
      } else {
        toast.error(res.message || 'Failed to accept friend request');
      }
    } catch {
      toast.error('Failed to accept friend request');
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleRejectFriendRequest = async () => {
    if (!user) return;
    setIsRequestLoading(true);
    try {
      const res = await profileApi.rejectFriendRequest(user.id);
      if (res.statusCode === 200) {
        toast.success('Friend request rejected');
        setUser({
          ...user,
          friendshipStatus: 'none',
          requestReceivedFromThem: false,
        });
      } else {
        toast.error(res.message || 'Failed to reject friend request');
      }
    } catch {
      toast.error('Failed to reject friend request');
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleProfileUpdated = (updatedUser: UserWithFriendStatus) => {
    setUser(updatedUser);
    resetAndFetch();
  };

  const handlePostCreated = () => {
    resetAndFetch();
    setIsCreateModalOpen(false);
  };

  if (isLoadingProfile || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen min-w-2xl">
      <div
        ref={scrollContainerRef}
        className="max-h-screen space-y-6 overflow-y-scroll pb-8"
      >
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          onEditProfile={() => setIsEditModalOpen(true)}
          onSendFriendRequest={handleSendFriendRequest}
          onCancelFriendRequest={handleCancelFriendRequest}
          onUnfriend={handleUnfriend}
          onAcceptFriendRequest={handleAcceptFriendRequest}
          onRejectFriendRequest={handleRejectFriendRequest}
          isRequestLoading={isRequestLoading}
          onAvatarClick={() => isOwnProfile && setIsEditModalOpen(true)}
        />

        <div className="mx-auto w-full max-w-2xl space-y-6 px-4 sm:px-6">
          <PostsTab
            user={user}
            isOwnProfile={isOwnProfile}
            isLoading={isLoadingPosts}
            posts={posts}
            isFetchingMore={isFetchingMore}
            onCreatePostClick={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>

      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onUpdated={handleProfileUpdated}
        />
      )}

      {isOwnProfile && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};
