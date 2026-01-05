import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Post } from '../types/post.type';
import { PostHeader } from './PostHeader';
import { ImageGallery } from './ImageGallery';
import { PostActions } from './PostActions';
import { CommentSection } from '@/features/comment/components/CommentSection';
import { useComments } from '@/features/comment/hooks/useComments';
import { postApi } from '../services/post.api';
import { SharePostModal } from './SharePostModal';
import { useCurrentUser } from '@/features/messaging/hooks/useCurrentUser';
import { EditPostModal } from './EditPostModal';
import { PostMenu } from './PostMenu';
import { OriginalPostPreview } from './OriginalPostPreview';

export const PostCard = memo(({ post }: { post: Post }) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [content, setContent] = useState(post.content);
  const [attachments, setAttachments] = useState(post.attachments || []);
  const [likeCount, setLikeCount] = useState(post.reactionCount || 0);
  const [shareCount, setShareCount] = useState(post._count?.shares || 0);
  const [liked, setLiked] = useState(Boolean(post.reacted ?? post.isReacted));
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isSharedPost = Boolean(post.originalPostId);
  const original = post.originalPost;
  const { fetchComments } = useComments(post.id);
  const { currentUserId } = useCurrentUser();
  const isOwner =
    currentUserId && String(currentUserId) === String(post.posterId);

  useEffect(() => {
    if (isCommentSectionOpen) {
      fetchComments();
    }
  }, [isCommentSectionOpen, fetchComments]);

  const handleLike = async () => {
    if (isLiking) return;
    const prevLiked = liked;
    const prevCount = likeCount;
    const nextLiked = !prevLiked;
    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));
    setIsLiking(true);
    try {
      const res = nextLiked
        ? await postApi.reactPost(post.id)
        : await postApi.unreactPost(post.id);

      if (res.statusCode === 201 || res.statusCode === 200) {
        if (typeof res.data.reactionCount === 'number') {
          setLikeCount(res.data.reactionCount);
        }
        if (
          typeof res.data.isReacted === 'boolean' ||
          typeof res.data.reacted === 'boolean'
        ) {
          setLiked(Boolean(res.data.isReacted ?? res.data.reacted));
        }
      } else {
        setLiked(prevLiked);
        setLikeCount(prevCount);
        toast.error(res.message || 'Failed to update reaction');
      }
    } catch (_err) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error('Failed to update reaction');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsShareModalOpen(true);
  };

  const handleShareConfirm = async (content: string) => {
    if (isSharing) return;
    const prevCount = shareCount;
    setIsSharing(true);
    try {
      const res = await postApi.createPost({
        content,
        originalPostId: post.id,
        attachments: [],
      });

      if (res.statusCode !== 200 && res.statusCode !== 201) {
        toast.error(res.message || 'Failed to share post');
        setShareCount(prevCount);
      } else {
        setShareCount(prevCount + 1);
      }
    } catch (_err) {
      setShareCount(prevCount);
      throw _err;
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    const confirmDelete = window.confirm('Delete this post?');
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      const res = await postApi.deletePost(post.id);
      if (res.statusCode === 200 || res.statusCode === 204) {
        toast.success('Post deleted');
        setIsDeleted(true);
        return;
      }
      toast.error(res.message || 'Failed to delete post');
    } catch (_err) {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleted) return null;

  const shareTarget = post.originalPost
    ? post.originalPost
    : { ...post, content };

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <PostHeader
        poster={post.poster}
        createdAt={post.createdAt}
        isShared={isSharedPost}
        onMoreClick={() => setShowMenu((v) => !v)}
      />

      {showMenu && (
        <PostMenu
          isOwner={Boolean(isOwner)}
          isDeleting={isDeleting}
          onEdit={() => {
            setShowMenu(false);
            setIsEditModalOpen(true);
          }}
          onShare={() => {
            setShowMenu(false);
            handleShare();
          }}
          onDelete={() => {
            setShowMenu(false);
            handleDelete();
          }}
        />
      )}

      <div className="px-4 pb-4">
        <p className="mb-4 text-[15px]">{content}</p>
        <ImageGallery attachments={attachments || []} />

        {original && <OriginalPostPreview originalPost={original} />}
      </div>

      <PostActions
        likeCount={likeCount}
        commentCount={post._count.comments}
        shareCount={shareCount}
        liked={liked}
        disableLike={isLiking}
        disableShare={isSharing}
        onLikeClick={handleLike}
        onCommentClick={() => setIsCommentSectionOpen((prev) => !prev)}
        onShareClick={handleShare}
      />

      {isCommentSectionOpen && (
        <CommentSection
          postId={post.id}
          currentUser={post.poster}
          isOpen={isCommentSectionOpen}
        />
      )}

      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        post={shareTarget}
        onShare={handleShareConfirm}
      />

      {isOwner && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          postId={post.id}
          initialContent={content}
          initialAttachments={attachments}
          onUpdated={({ content: newContent, attachments: newAtt }) => {
            setContent(newContent);
            setAttachments(newAtt);
          }}
        />
      )}
    </div>
  );
});
PostCard.displayName = 'PostCard';
