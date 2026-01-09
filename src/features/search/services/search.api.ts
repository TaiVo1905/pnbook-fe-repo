import { httpClient } from '@/core/api/httpClient.api';
import type { BaseResponse } from '@/core/types/api.type';
import type { Post } from '@/shared/types/post.type';
import type { SearchUser } from '../types/search.type';

export const searchApi = {
  searchUsers: (keyword: string, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      keyword,
      page: page.toString(),
      limit: limit.toString(),
    });
    return httpClient.get<BaseResponse<SearchUser[]>>(
      `/search/users?${params}`
    );
  },

  searchPosts: (keyword: string, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      keyword,
      page: page.toString(),
      limit: limit.toString(),
    });
    return httpClient.get<BaseResponse<Post[]>>(`/search/posts?${params}`);
  },
};
