import { httpClient } from '@/core/api/httpClient.api';
import type { BaseResponse } from '@/core/types/api.type';
import type { Post } from '@/shared/types/post.type';
import type { UserProfile } from '@/core/api/user.api';
import type { UserProfileDetail, ApiResponse } from '../types/profile.type';

export const profileApi = {
  getUserProfile: async (
    userId: string
  ): Promise<
    ApiResponse<
      UserProfileDetail & {
        relationshipStatus?: {
          isFriend: boolean;
          sentFriendRequest: boolean;
          receivedFriendRequest: boolean;
        };
      }
    >
  > => {
    try {
      const res = await httpClient.get<
        ApiResponse<
          UserProfileDetail & {
            relationshipStatus?: {
              isFriend: boolean;
              sentFriendRequest: boolean;
              receivedFriendRequest: boolean;
            };
          }
        >
      >(`/users/${userId}`);
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to fetch user profile',
        timeStamp: new Date().toISOString(),
      };
    }
  },

  getUserPosts: async (
    userId: string,
    page = 1,
    limit = 20
  ): Promise<BaseResponse<Post[]>> => {
    try {
      const res = await httpClient.get<BaseResponse<Post[]>>(
        `/users/${userId}/posts?page=${page}&limit=${limit}`
      );
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to fetch user posts',
        timeStamp: new Date().toISOString(),
        data: [],
      };
    }
  },

  getUserFriends: async (
    userId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<UserProfile[]>> => {
    try {
      const res = await httpClient.get<ApiResponse<UserProfile[]>>(
        `/users/${userId}/friends?page=${page}&limit=${limit}`
      );
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to fetch user friends',
        timeStamp: new Date().toISOString(),
      };
    }
  },

  updateProfile: async (payload: {
    name?: string;
    avatarUrl?: string;
  }): Promise<ApiResponse<UserProfileDetail>> => {
    try {
      const res = await httpClient.patch<ApiResponse<UserProfileDetail>>(
        '/users/me',
        payload
      );
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to update profile',
        timeStamp: new Date().toISOString(),
      };
    }
  },

  sendFriendRequest: async (friendId: string): Promise<ApiResponse<null>> => {
    if (!friendId) {
      return {
        statusCode: 400,
        message: 'Friend ID is required',
        timeStamp: new Date().toISOString(),
      };
    }
    try {
      const res = await httpClient.post<ApiResponse<null>>('/friendships', {
        addresseeId: friendId,
      });
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to send friend request',
        timeStamp: new Date().toISOString(),
      };
    }
  },

  cancelFriendRequest: async (friendId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await httpClient.delete<ApiResponse<null>>(
        `/friendships/requests/${friendId}`
      );
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to cancel friend request',
        timeStamp: new Date().toISOString(),
      };
    }
  },

  unfriend: async (friendId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await httpClient.delete<ApiResponse<null>>(
        `/friendships/${friendId}`
      );
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to unfriend',
        timeStamp: new Date().toISOString(),
      };
    }
  },

  acceptFriendRequest: async (friendId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await httpClient.patch<ApiResponse<null>>(
        `/friendships/requests/${friendId}/accept`,
        {}
      );
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to accept friend request',
        timeStamp: new Date().toISOString(),
      };
    }
  },

  rejectFriendRequest: async (userId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await httpClient.delete<ApiResponse<null>>(
        `/friendships/requests/${userId}`
      );
      return res;
    } catch (_error) {
      return {
        statusCode: 500,
        message: 'Failed to reject friend request',
        timeStamp: new Date().toISOString(),
      };
    }
  },
};
