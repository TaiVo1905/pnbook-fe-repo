export type FriendRequestStatus = 'pending' | 'accepted' | 'cancelled';

export interface UserInfo {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  initials?: string;
}

export interface FriendRequest {
  id: string;
  sender: UserInfo;
  receiver: UserInfo;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Friend {
  id: string;
  user: UserInfo;
  connectedAt: string;
}

export interface FriendApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  timeStamp: string;
}
