import { useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PostLayout from '@/features/post/layouts/PostLayout';
import { SearchPostsList } from '../components/SearchPostsList';
import { SearchResultTabs } from '../components/SearchResultTabs';
import { SearchUsersList } from '../components/SearchUsersList';
import { useSearchResults } from '../hooks/useSearchResults';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = useMemo(
    () => (searchParams.get('keyword') || '').trim(),
    [searchParams]
  );
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    activeTab,
    setActiveTab,
    users,
    posts,
    isLoading,
    isFetchingMore,
    loadMorePosts,
    hasMorePosts,
  } = useSearchResults(keyword);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (
      !container ||
      activeTab !== 'posts' ||
      !hasMorePosts ||
      isFetchingMore ||
      isLoading
    )
      return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - (scrollTop + clientHeight) < 500) {
      void loadMorePosts();
    }
  }, [activeTab, hasMorePosts, isFetchingMore, isLoading, loadMorePosts]);

  if (!keyword) {
    return (
      <PostLayout>
        <div className="bg-card text-muted-foreground rounded-xl border p-6 text-center shadow-sm">
          Enter a keyword to start searching.
        </div>
      </PostLayout>
    );
  }

  return (
    <PostLayout>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-screen space-y-6 overflow-y-auto"
      >
        <SearchResultTabs
          keyword={keyword}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {isLoading ? (
          <div className="py-10 text-center">Searching...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <SearchUsersList
                users={users}
                onViewProfile={(userId) => navigate(`/app/profile/${userId}`)}
              />
            )}

            {activeTab === 'posts' && (
              <SearchPostsList posts={posts} isFetchingMore={isFetchingMore} />
            )}
          </>
        )}
      </div>
    </PostLayout>
  );
};
