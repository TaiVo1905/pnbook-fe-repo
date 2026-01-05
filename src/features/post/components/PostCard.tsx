import { memo, useEffect, useState } from 'react';
import type { Post } from '../types/post.type';
import { PostHeader } from './PostHeader';
import { ImageGallery } from './ImageGallery';
import { PostActions } from './PostActions';
import { CommentSection } from '@/features/comment/components/CommentSection';
import { useComments } from '@/features/comment/hooks/useComments';

export const PostCard = memo(({ post }: { post: Post }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const { comments, fetchComments } = useComments(post.id);

  useEffect(() => {
    if (isCommentSectionOpen || comments.length === 0) {
      fetchComments();
    }
  }, [isCommentSectionOpen, comments.length, fetchComments]);

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <PostHeader user={post.user} createdAt={post.createdAt} />

      <div className="px-4 pb-4">
        <p className="mb-4 text-[15px]">{post.content}</p>
        <ImageGallery attachments={post.attachments || []} />
      </div>

      <PostActions
        likeCount={post.reactionCount}
        commentCount={comments.length}
        shareCount={post.shareCount}
        onCommentClick={() => setIsCommentSectionOpen((prev) => !prev)}
      />

      {isCommentSectionOpen && (
        <CommentSection
          postId={post.id}
          currentUser={post.user}
          isOpen={isCommentSectionOpen}
        />
      )}
    </div>
  );
});
PostCard.displayName = 'PostCard';
