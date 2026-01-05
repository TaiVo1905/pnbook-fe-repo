import { useState, useEffect, useCallback } from 'react';
import { CreatePostModal } from '../components/CreatePostModal';
import { PostCard } from '../components/PostCard';
import { toast } from 'sonner';
import { postApi } from '../services/post.api';
import type { Post } from '../types/post.type';
import { Button } from '@/core/shadcn/components/ui/button';
import { ImageIcon } from 'lucide-react';
import PostLayout from '../layouts/PostLayout';
import { userApi, type UserProfile } from '@/core/api/user.api';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await userApi.getCurrentUser();
      if (response) {
        setCurrentUser(response.data);
      }
    } catch {
      toast.error('Failed to fetch current user');
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const fetchFeeds = useCallback(async () => {
    try {
      const response = await postApi.getFeeds();

      if (response && response.statusCode === 200) {
        setPosts(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch feeds');
      }
    } catch {
      toast.error('Failed to load feeds');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  if (loading) {
    return <div className="py-10 text-center">Loading feeds...</div>;
  }

  return (
    <PostLayout>
      <div className="space-y-6">
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
              className="bg-border/50 text-muted-foreground hover:bg-border flex-1 cursor-pointer rounded-full px-5 py-2.5 text-left transition-colors"
            >
              What do you think?
            </button>
          </div>

          <div className="flex justify-center border-t pt-2">
            <Button
              variant="ghost"
              className="text-foreground/70 gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <ImageIcon size={20} className="text-green-500" />
              <span className="text-[14px] font-medium">Images/Videos</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No posts available.
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPostCreated={fetchFeeds}
        />
      </div>
    </PostLayout>
  );
};
