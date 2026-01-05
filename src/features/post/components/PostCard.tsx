import { memo, useEffect, useState } from 'react';
import type { Post } from '../types/post.type';
import { PostHeader } from './PostHeader';
import { ImageGallery } from './ImageGallery';
import { PostActions } from './PostActions';
import { CommentSection } from '@/features/comment/components/CommentSection';
import { useComments } from '@/features/comment/hooks/useComments';

export const PostCard = memo(({ post }: { post: Post }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const { fetchComments } = useComments(post.id);

  useEffect(() => {
    if (isCommentSectionOpen) {
      fetchComments();
    }
  }, [isCommentSectionOpen, fetchComments]);

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <PostHeader poster={post.poster} createdAt={post.createdAt} />

      <div className="px-4 pb-4">
        <p className="mb-4 text-[15px]">{post.content}</p>
        <ImageGallery attachments={post.attachments || []} />
      </div>

      <PostActions
        likeCount={post.reactionCount}
        commentCount={post._count.comments}
        shareCount={post._count.shares}
        onCommentClick={() => setIsCommentSectionOpen((prev) => !prev)}
      />

      {isCommentSectionOpen && (
        <CommentSection
          postId={post.id}
          currentUser={post.poster}
          isOpen={isCommentSectionOpen}
        />
      )}
    </div>
  );
});
PostCard.displayName = 'PostCard';
