import { useCallback, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { commentApi } from '../services/comment.api';
import type { CommentWithReplies } from '../types/comment.type';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const { commentCount, totalReplyCount } = useMemo(() => {
    const total = comments.length;
    const replies = comments.reduce(
      (sum, comment) => sum + (comment.replies?.length || 0),
      0
    );
    return { commentCount: total, totalReplyCount: replies };
  }, [comments]);

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const response = await commentApi.getComments(postId);
      if (response.statusCode === 200) {
        const commentsData = response.data || [];
        const commentsWithReplies = await Promise.all(
          commentsData.map(async (comment) => {
            try {
              const repliesRes = await commentApi.getReplies(comment.id);
              if (repliesRes.statusCode === 200) {
                return { ...comment, replies: repliesRes.data || [] };
              }
            } catch (_error) {
              toast.error('Unable to load replies for a comment');
            }
            return { ...comment, replies: [] };
          })
        );
        setComments(commentsWithReplies);
      } else {
        toast.error(response.message || 'Failed to load comments');
      }
    } catch (_error) {
      toast.error('Unable to load comments');
    } finally {
      setLoadingComments(false);
    }
  }, [postId]);

  const createComment = useCallback(
    async (content: string) => {
      try {
        const response = await commentApi.createComment(postId, content);
        if (response.statusCode === 200 || response.statusCode === 201) {
          setComments((prev) => [{ ...response.data, replies: [] }, ...prev]);
          return true;
        } else {
          toast.error(response.message || 'Failed to post comment');
          return false;
        }
      } catch (_error) {
        toast.error('Unable to post comment');
        return false;
      }
    },
    [postId]
  );

  const createReply = useCallback(
    async (commentId: string, content: string) => {
      try {
        const response = await commentApi.createReply(commentId, content);
        if (response.statusCode === 200) {
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: [response.data, ...(comment.replies || [])],
                  }
                : comment
            )
          );
          return true;
        } else {
          toast.error(response.message || 'Failed to post reply');
          return false;
        }
      } catch (_error) {
        toast.error('Unable to post reply');
        return false;
      }
    },
    []
  );

  const loadReplies = useCallback(async (commentId: string) => {
    try {
      const response = await commentApi.getReplies(commentId);
      if (response.statusCode === 200) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: response.data }
              : comment
          )
        );
      } else {
        toast.error(response.message || 'Failed to load replies');
      }
    } catch (_error) {
      toast.error('Unable to load replies');
    }
  }, []);

  return {
    comments,
    commentCount,
    totalReplyCount,
    loadingComments,
    fetchComments,
    createComment,
    createReply,
    loadReplies,
  };
};
