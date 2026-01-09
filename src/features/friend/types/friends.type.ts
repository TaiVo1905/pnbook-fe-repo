export type FriendRequestStatus = 'idle' | 'pending' | 'accepted' | 'cancelled';

export interface UserInfo {
  id: string;
  name: string;
  title?: string;
  avatarUrl?: string;
  initials?: string;
}

export interface SendFriendRequestResponse {
  requesterId: string;
  addresseeId: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface FriendRequest {
  id: string;
  requesterId: string;
  requester: UserInfo;
  addresseeId: string;
  addressee: UserInfo;
  status: FriendRequestStatus;
  createdAt: string;
  deletedAt: string | null;
  updatedAt?: string;
}

export interface Friend {
  id: string;
  userId: string;
  friend: UserInfo;
  status: 'accepted' | 'block';
  connectedAt: string;
}

export interface SendFriendRequestPayload {
  friendId: string;
}

export interface RemoveFriendPayload {
  friendId: string;
}
export interface SendFriendRequestPayload {
  friendId: string;
}

export interface RemoveFriendPayload {
  friendId: string;
}
export interface FriendApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  timeStamp: string;
}
