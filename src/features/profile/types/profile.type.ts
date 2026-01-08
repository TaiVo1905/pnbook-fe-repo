export interface UserProfileDetail {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface UserWithFriendStatus extends UserProfileDetail {
  friendshipStatus: 'none' | 'pending' | 'accepted' | 'blocked';
  isFriend: boolean;
  requestSentByMe?: boolean;
  requestReceivedFromThem?: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  timeStamp: string;
  data?: T;
}
