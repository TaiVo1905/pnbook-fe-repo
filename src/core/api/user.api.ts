import { httpClient } from './httpClient.api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

let cachedUser: UserProfile | null = null;
let inFlight: Promise<UserProfile> | null = null;

export const userApi = {
  getCurrentUser: async () => {
    if (cachedUser) {
      return { data: cachedUser } as { data: UserProfile };
    }
    if (inFlight) {
      const data = await inFlight;
      return { data } as { data: UserProfile };
    }
    inFlight = (async () => {
      const res = await httpClient.get<{ data: UserProfile }>('/auth/me');
      cachedUser = res.data;
      return res.data;
    })();
    const data = await inFlight;
    inFlight = null;
    return { data } as { data: UserProfile };
  },
  resetCurrentUserCache: () => {
    cachedUser = null;
    inFlight = null;
  },
};
