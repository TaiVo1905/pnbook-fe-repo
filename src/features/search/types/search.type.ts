import type { Post } from '@/shared/types/post.type';

export interface SearchUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface SearchHistoryItem {
  id: string;
  keyword: string;
  userId: string;
  createdAt: string;
}

export interface SearchHistoryResponse {
  data: SearchHistoryItem[];
  meta?: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export type SearchTab = 'users' | 'posts';

export interface SearchState {
  users: SearchUser[];
  posts: Post[];
  activeTab: SearchTab;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isFetchingMore: boolean;
}
