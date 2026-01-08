import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { CreatePostModal } from '@/shared/modals/CreatePostModal';
import { PostCard } from '@/shared/components/post/PostCard';
import { toast } from 'sonner';
import { ImageIcon, Loader2 } from 'lucide-react';
import { ActionButton } from '@/shared/components/ActionButton';
import PostLayout from '../layouts/PostLayout';
import { userApi, type UserProfile } from '@/core/api/user.api';
import { usePostFeed } from '../hooks/usePostFeed';

export const FeedPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    posts,
    isLoading,
    isFetchingMore,
    hasMore,
    fetchMore,
    fetchLatest,
    prevScrollHeightRef,
    prevScrollTopRef,
    isLoadingMoreRef,
  } = usePostFeed();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        if (response) {
          setCurrentUser(response.data);
        }
      } catch {
        toast.error('Failed to fetch current user');
      }
    };
    fetchCurrentUser();
  }, []);

  const handleScroll = async () => {
    if (!scrollRef.current) return;
    if (!hasMore || isFetchingMore || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (scrollHeight - (scrollTop + clientHeight) < 500) {
      prevScrollHeightRef.current = scrollRef.current.scrollHeight;
      prevScrollTopRef.current = scrollRef.current.scrollTop;
      isLoadingMoreRef.current = true;
      await fetchMore();
    }
  };

  useLayoutEffect(() => {
    if (isLoadingMoreRef.current && scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const newScrollHeight = scrollRef.current.scrollHeight;
          const prevScrollHeight = prevScrollHeightRef.current;
          const prevScrollTop = prevScrollTopRef.current;
          scrollRef.current.scrollTop =
            prevScrollTop + (newScrollHeight - prevScrollHeight);
        }
      });
    }
  }, [posts]);

  useLayoutEffect(() => {
    if (isLoadingMoreRef.current && !isFetchingMore) {
      const timeout = setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isFetchingMore]);

  return (
    <PostLayout>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-screen space-y-6 overflow-y-auto"
      >
        <div className="bg-card rounded-xl border p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border">
              <img
                src={
                  currentUser
                    ? currentUser.avatarUrl
                    : 'https://github.com/shadcn.png'
                }
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 cursor-pointer rounded-full border px-5 py-2.5 text-left text-gray-500 transition-colors hover:bg-gray-100"
            >
              What do you think?
            </button>
          </div>

          <div className="flex justify-center border-t pt-2">
            <ActionButton
              variant="ghost"
              className="flex justify-center gap-2 rounded-lg"
              onClick={() => setIsModalOpen(true)}
            >
              <ImageIcon size={20} className="text-green-500" />
              <span className="text-[13px] font-medium text-gray-600">
                Images/Videos
              </span>
            </ActionButton>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center">Loading feeds...</div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground py-10 text-center">
            No posts available.
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

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPostCreated={fetchLatest}
        />
      </div>
    </PostLayout>
  );
};
