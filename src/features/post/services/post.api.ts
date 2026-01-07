import { httpClient } from '@/core/api/httpClient.api';
import type { BaseResponse } from '@/core/types/api.type';
import type {
  Post,
  CreatePostPayload,
  PresignedUrlRequest,
  PresignedUrlResponse,
  UpdatePostPayload,
} from '../types/post.type';

export const postApi = {
  getFeeds: (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return httpClient.get<BaseResponse<Post[]>>(`/feeds?${params}`);
  },

  createPost: (payload: CreatePostPayload) =>
    httpClient.post<BaseResponse<Post>>('/posts', payload),

  reactPost: (postId: string) =>
    httpClient.post<
      BaseResponse<{
        reactionCount: number;
        isReacted?: boolean;
        reacted?: boolean;
      }>
    >(`/posts/${postId}/react`, {}),

  unreactPost: (postId: string) =>
    httpClient.delete<
      BaseResponse<{
        reactionCount: number;
        isReacted?: boolean;
        reacted?: boolean;
      }>
    >(`/posts/${postId}/react`),

  getPresignedUrl: ({ filename, mimeType }: PresignedUrlRequest) =>
    httpClient.post<BaseResponse<PresignedUrlResponse>>('/get-presigned-url', {
      filename,
      mimeType,
    }),

  getUserById: (userId: string) =>
    httpClient.get<BaseResponse<{ name: string; avatarUrl: string }>>(
      `/users/${userId}`
    ),

  searchUsers: (keyword: string, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      keyword,
      page: page.toString(),
      limit: limit.toString(),
    });
    return httpClient.get<BaseResponse<[]>>(`/search/users?${params}`);
  },

  updatePost: (postId: string, payload: UpdatePostPayload) =>
    httpClient.patch<BaseResponse<Post>>(`/posts/${postId}`, payload),

  deletePost: (postId: string) =>
    httpClient.delete<BaseResponse<void>>(`/posts/${postId}`),
};
