import { httpClient } from '@/core/api/httpClient.api';
import type { SearchHistoryResponse } from '../types/search.type';

export const searchHistoryApi = {
  getSearchHistory: (page = 1, limit = 10) =>
    httpClient.get<SearchHistoryResponse>(
      `/search-history?page=${page}&limit=${limit}`
    ),
  deleteById: (id: string) =>
    httpClient.delete<{ message: string }>(`/search-history/${id}`),
  clearAll: () => httpClient.delete<{ message: string }>(`/search-history`),
};
