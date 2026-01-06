import { httpClient } from '@/core/api/httpClient.api';
import type { BaseResponse } from '@/core/types/api.type';
import type {
  UserInfo,
  Friend,
  FriendRequest,
  SendFriendRequestPayload,
  RemoveFriendPayload,
} from '@/features/friend/types/friends.type';

export async function getFriendSuggestions(
  page = 1,
  limit = 20
): Promise<FriendApiResponse<FriendRequest[]>> {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/friendships?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!res.ok) {
      return {
        statusCode: res.status,
        message: 'Failed to fetch friend suggestions',
        timeStamp: new Date().toISOString(),
      };
    }

    const data: FriendRequest[] = await res.json();

    return {
      statusCode: res.status,
      message: 'Get friend suggestions success',
      timeStamp: new Date().toISOString(),
      data,
    };
  } catch {
    return {
      statusCode: 500,
      message: 'Network error when fetching friend suggestions',
      timeStamp: new Date().toISOString(),
    };
  }
}

export interface SendFriendRequestPayload {
  friendId: string;
}

export async function postSendFriendRequest(
  payload: SendFriendRequestPayload
): Promise<FriendApiResponse<null>> {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/friendships`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ addresseeId: payload.friendId }),
      }
    );

    if (!res.ok) {
      return {
        statusCode: res.status,
        message: 'Send friend request failed',
        timeStamp: new Date().toISOString(),
      };
    }

    return {
      statusCode: res.status,
      message: 'Send friend request success',
      timeStamp: new Date().toISOString(),
      data: null,
    };
  } catch {
    return {
      statusCode: 500,
      message: 'Network error when sending friend request',
      timeStamp: new Date().toISOString(),
    };
  }
}
