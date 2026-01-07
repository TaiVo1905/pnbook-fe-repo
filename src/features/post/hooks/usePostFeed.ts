import { useCallback, useState, useRef, useLayoutEffect } from 'react';
import { postApi } from '../services/post.api';
import type { Post } from '../types/post.type';
import { toast } from 'sonner';

const LIMIT = 20;

export const usePostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const fetchLatest = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await postApi.getFeeds(1, LIMIT);
      if (response?.statusCode === 200) {
        setPosts(response.data || []);
        setCurrentPage(1);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch {
      toast.error('System error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMore = useCallback(async () => {
    if (isFetchingMore || isLoading) return;

    const nextPage = currentPage + 1;
    if (nextPage > totalPages) return;

    setIsFetchingMore(true);
    try {
      const response = await postApi.getFeeds(nextPage, LIMIT);
      if (response?.statusCode === 200) {
        setPosts((prev) => [...prev, ...(response.data || [])]);
        setCurrentPage(nextPage);
        if (response.meta?.totalPages) {
          setTotalPages(response.meta.totalPages);
        }
      }
    } catch {
      toast.error('System error. Please try again later.');
    } finally {
      setIsFetchingMore(false);
    }
  }, [currentPage, totalPages, isFetchingMore, isLoading]);

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  useLayoutEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  return {
    posts,
    setPosts,
    isLoading,
    isFetchingMore,
    hasMore: currentPage < totalPages,
    fetchMore,
    fetchLatest,
    addPost,
    prevScrollHeightRef,
    prevScrollTopRef,
    isLoadingMoreRef,
  };
};
