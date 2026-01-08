import { memo } from 'react';
import { Loader2, ImageIcon } from 'lucide-react';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { ActionButton } from '@/shared/components/ActionButton';
import { PostCard } from '@/shared/components/post/PostCard';
import type { Post } from '@/shared/types/post.type';
import type { UserWithFriendStatus } from '../types/profile.type';

interface PostsTabProps {
  user: UserWithFriendStatus;
  isOwnProfile: boolean;
  isLoading: boolean;
  posts: Post[];
  isFetchingMore: boolean;
  onCreatePostClick: () => void;
}

export const PostsTab = memo(
  ({
    user,
    isOwnProfile,
    isLoading,
    posts,
    isFetchingMore,
    onCreatePostClick,
  }: PostsTabProps) => {
    return (
      <div className="space-y-6">
        {isOwnProfile && (
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                <UserAvatar
                  name={user.name}
                  avatar={user.avatarUrl}
                  className="h-full w-full"
                />
              </div>
              <button
                onClick={onCreatePostClick}
                className="hover:bg-muted flex-1 cursor-pointer rounded-full border px-5 py-2.5 text-left text-gray-500 transition-colors"
              >
                What do you think?
              </button>
            </div>

            <div className="flex justify-center border-t pt-2">
              <ActionButton
                variant="ghost"
                className="flex justify-center gap-2 rounded-lg"
                onClick={onCreatePostClick}
              >
                <ImageIcon size={20} className="text-green-500" />
                <span className="text-[13px] font-medium text-gray-600">
                  Images/Videos
                </span>
              </ActionButton>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground py-10 text-center">
            No posts yet
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {isFetchingMore && (
          <div className="flex justify-center py-6">
            <Loader2 size={24} className="animate-spin text-blue-600" />
          </div>
        )}
      </div>
    );
  }
);

PostsTab.displayName = 'PostsTab';
