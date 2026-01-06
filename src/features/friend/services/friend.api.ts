import { httpClient } from '@/core/api/httpClient.api';
import type { BaseResponse } from '@/core/types/api.type';
import type {
  UserInfo,
  Friend,
  FriendRequest,
  SendFriendRequestPayload,
  RemoveFriendPayload,
} from '@/features/friend/types/friends.type';

export const friendApi = {
  getUserById: (userId: string) =>
    httpClient.get<BaseResponse<{ name: string; avatarUrl: string }>>(
      `/users/${userId}`
    ),

  getAllUsers: () => httpClient.get<UserInfo[]>(`/users`),

  getFriendRequests: (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return httpClient.get<BaseResponse<FriendRequest[]>>(
      `/friendships/requests?${params}`
    );
  },

  sendFriendRequest: (payload: SendFriendRequestPayload) => {
    return httpClient.post<BaseResponse<null>>('/friendships', payload);
  },

  getFriends: (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return httpClient.get<BaseResponse<Friend[]>>(`/friendships?${params}`);
  },

  updateFriendStatus: (friendId: string, status: 'accepted' | 'block') => {
    return httpClient.patch<BaseResponse<null>>(`/friendships/${friendId}`, {
      status: status,
    });
  },

  unFriend: (friendId: string) => {
    return httpClient.delete<BaseResponse<null>>(`/friendships/${friendId}`);
  },

  getIncomingRequests: (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return httpClient.get<BaseResponse<FriendRequest[]>>(
      `/friendships/requests?${params}`
    );
  },

  acceptRequest: (requesterId: string) => {
    return httpClient.patch<BaseResponse<null>>(
      `/friendships/requests/${requesterId}/accept`,
      {}
    );
  },

  rejectRequest: (requesterId: string) => {
    return httpClient.delete<BaseResponse<null>>(
      `/friendships/requests/${requesterId}`
    );
  },
};

export type { SendFriendRequestPayload, RemoveFriendPayload };
