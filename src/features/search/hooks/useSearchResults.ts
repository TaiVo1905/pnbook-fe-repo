import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { searchApi } from '../services/search.api';
import type { Post } from '@/shared/types/post.type';
import type { SearchTab, SearchUser } from '../types/search.type';

const LIMIT = 20;

export const useSearchResults = (keyword: string) => {
  const [activeTab, setActiveTab] = useState<SearchTab>('users');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadInitial = useCallback(async () => {
    if (!keyword) {
      setUsers([]);
      setPosts([]);
      setCurrentPage(1);
      setTotalPages(1);
      return;
    }
    setIsLoading(true);
    try {
      const [usersRes, postsRes] = await Promise.all([
        searchApi.searchUsers(keyword),
        searchApi.searchPosts(keyword, 1, LIMIT),
      ]);

      if (usersRes.statusCode === 200) {
        setUsers(usersRes.data || []);
      } else {
        setUsers([]);
      }

      if (postsRes.statusCode !== 200) {
        toast.error(postsRes.message || 'Search posts failed');
        setPosts([]);
        setCurrentPage(1);
        setTotalPages(1);
      } else {
        setPosts(postsRes.data || []);
        setCurrentPage(1);
        setTotalPages(postsRes.meta?.totalPages ?? 1);
      }
    } catch (_err) {
      toast.error('Server connection error');
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  const loadMorePosts = useCallback(async () => {
    if (!keyword || isFetchingMore || isLoading) return;
    const nextPage = currentPage + 1;
    if (nextPage > totalPages) return;

    setIsFetchingMore(true);
    try {
      const res = await searchApi.searchPosts(keyword, nextPage, LIMIT);
      if (res.statusCode === 200) {
        setPosts((prev) => [...prev, ...(res.data || [])]);
        setCurrentPage(nextPage);
        setTotalPages(res.meta?.totalPages ?? totalPages);
      }
    } finally {
      setIsFetchingMore(false);
    }
  }, [keyword, isFetchingMore, isLoading, currentPage, totalPages]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const hasMorePosts = activeTab === 'posts' && currentPage < totalPages;

  return {
    activeTab,
    setActiveTab,
    users,
    posts,
    isLoading,
    isFetchingMore,
    loadMorePosts,
    hasMorePosts,
  };
};
