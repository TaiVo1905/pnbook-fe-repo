import { httpClient } from '@/core/api/httpClient.api';
import type { BaseResponse } from '@/core/types/api.type';
import type { CommentWithReplies, Comment, Reply } from '../types/comment.type';

export const commentApi = {
  getComments: (postId: string) =>
    httpClient.get<BaseResponse<CommentWithReplies[]>>(
      `/posts/${postId}/comments`
    ),

  createComment: (postId: string, content: string) =>
    httpClient.post<BaseResponse<Comment>>(`/comments`, {
      content,
      postId,
    }),

  createReply: (commentId: string, content: string) =>
    httpClient.post<BaseResponse<Reply>>(`/replies`, {
      content,
      commentId,
    }),

  getReplies: (commentId: string) =>
    httpClient.get<BaseResponse<Reply[]>>(`/comments/${commentId}/replies`),
};
