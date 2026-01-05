import { httpClient } from './httpClient.api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export const userApi = {
  getCurrentUser: () => httpClient.get<{ data: UserProfile }>('/auth/me'),
};
