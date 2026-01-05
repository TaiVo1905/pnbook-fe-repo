import { useState, useEffect, useCallback } from 'react';
import { CreatePostModal } from '../components/CreatePostModal';
import { PostCard } from '../components/PostCard';
import { toast } from 'sonner';
import { postApi } from '../services/post.api';
import type { Post } from '../types/post.type';
import { Button } from '@/core/shadcn/components/ui/button';
import { ImageIcon } from 'lucide-react';
import PostLayout from '../layouts/PostLayout';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFeedsAndUsers = useCallback(async () => {
    try {
      const response = await postApi.getFeeds();

      if (response && response.statusCode === 200) {
        const feedData = response.data;

        const postsWithUserData = await Promise.all(
          feedData.map(async (post: Post) => {
            try {
              const userRes = await postApi.getUserById(post.posterId);

              if (userRes && userRes.statusCode === 200) {
                return {
                  ...post,
                  user: {
                    name: userRes.data.name,
                    avatar: userRes.data.avatarUrl,
                  },
                };
              }
            } catch (err: unknown) {
              console.error(`Failed to fetch user ${post.posterId}`, err);
            }

            return post;
          })
        );

        setPosts(postsWithUserData);
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
    fetchFeedsAndUsers();
  }, [fetchFeedsAndUsers]);

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
                src="https://github.com/shadcn.png"
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-border/50 text-muted-foreground hover:bg-border flex-1 rounded-full px-5 py-2.5 text-left transition-colors"
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
          onPostCreated={fetchFeedsAndUsers}
        />
      </div>
    </PostLayout>
  );
};
