import { Loader2 } from 'lucide-react';
import { PostCard } from '@/shared/components/post/PostCard';
import type { Post } from '@/shared/types/post.type';

interface SearchPostsListProps {
  posts: Post[];
  isFetchingMore: boolean;
}

export const SearchPostsList = ({
  posts,
  isFetchingMore,
}: SearchPostsListProps) => {
  if (!posts.length) {
    return (
      <div className="text-muted-foreground py-10 text-center">
        No posts found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {isFetchingMore && (
        <div className="flex justify-center py-6">
          <Loader2 size={24} className="animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
};
