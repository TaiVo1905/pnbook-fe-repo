import {
  useCallback,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react';
import { toast } from 'sonner';
import { profileApi } from '../services/profile.api';
import type { Post } from '@/shared/types/post.type';

const LIMIT = 20;

export const useUserProfilePosts = (userId?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const fetchLatest = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await profileApi.getUserPosts(userId, 1, LIMIT);
      if (response.data) {
        setPosts(response.data);
        setPage(1);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch (_error) {
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchMore = useCallback(async () => {
    if (!userId || page >= totalPages || isFetchingMore || isLoading) return;

    const nextPage = page + 1;
    setIsFetchingMore(true);

    try {
      const response = await profileApi.getUserPosts(userId, nextPage, LIMIT);
      if (response.data) {
        setPosts((prev) => [...prev, ...response.data]);
        if (response.meta?.totalPages) {
          setTotalPages(response.meta.totalPages);
        }
        setPage(nextPage);
      }
    } catch (_error) {
      toast.error('Failed to load more posts');
    } finally {
      setIsFetchingMore(false);
    }
  }, [userId, page, totalPages, isFetchingMore, isLoading]);

  const resetAndFetch = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setPosts([]);
    setPage(1);
    try {
      const response = await profileApi.getUserPosts(userId, 1, LIMIT);
      if (response.data) {
        setPosts(response.data);
        setPage(1);
        setTotalPages(response.meta?.totalPages || 1);
      }
    } catch (_error) {
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollHeight - (scrollTop + clientHeight) < 500) {
      if (!isLoadingMoreRef.current && page < totalPages) {
        isLoadingMoreRef.current = true;
        prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
        prevScrollTopRef.current = scrollContainerRef.current.scrollTop;
        void fetchMore();
      }
    }
  }, [page, totalPages, fetchMore]);

  const hasMore = page < totalPages;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useLayoutEffect(() => {
    if (isLoadingMoreRef.current && scrollContainerRef.current) {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          const newScrollHeight = scrollContainerRef.current.scrollHeight;
          const prevScrollHeight = prevScrollHeightRef.current;
          const prevScrollTop = prevScrollTopRef.current;
          scrollContainerRef.current.scrollTop =
            prevScrollTop + (newScrollHeight - prevScrollHeight);
        }
      });
    }
  }, [posts]);

  useLayoutEffect(() => {
    if (isLoadingMoreRef.current && !isFetchingMore) {
      const timeout = setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isFetchingMore]);

  return {
    posts,
    isLoading,
    isFetchingMore,
    hasMore,
    fetchMore,
    fetchLatest,
    resetAndFetch,
    scrollContainerRef,
  };
};
