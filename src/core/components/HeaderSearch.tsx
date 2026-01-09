import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/core/shadcn/components/ui/input';
import { searchHistoryApi } from '@/features/search/services/searchHistory.api';
import { type SearchHistoryItem } from '@/features/search/types/search.type';
import { ActionButton } from '@/shared/components/ActionButton';
import { IconButton } from '@/shared/components/IconButton';

interface HeaderSearchProps {
  className?: string;
  placeholder?: string;
}

export const HeaderSearch = ({
  className = '',
  placeholder = 'Search PnBook',
}: HeaderSearchProps) => {
  const [keyword, setKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const historyListRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && keyword.trim()) {
        e.preventDefault();
        navigate(
          `/app/home/search?keyword=${encodeURIComponent(keyword.trim())}`
        );
        setShowHistory(false);
      }
    },
    [keyword, navigate]
  );

  const loadHistory = useCallback(
    async (page = 1, append = false) => {
      if (loadingHistory) return;
      try {
        setLoadingHistory(true);
        const res = await searchHistoryApi.getSearchHistory(page, 10);
        if (Array.isArray(res.data)) {
          setSearchHistory((prev) =>
            append ? [...prev, ...res.data] : res.data
          );
        }
        const totalPages = res?.meta?.totalPages ?? 1;
        setHasMoreHistory(page < totalPages);
        setHistoryPage(page);
      } catch (error) {
        console.error('Failed to load search history:', error);
      } finally {
        setLoadingHistory(false);
      }
    },
    [loadingHistory]
  );

  const ensureHistoryFilled = useCallback(() => {
    if (!showHistory || keyword.trim()) return;
    if (!hasMoreHistory || loadingHistory) return;
    const el = historyListRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 12;
    const notScrollable = el.scrollHeight <= el.clientHeight + 4;
    if (nearBottom || notScrollable) {
      void loadHistory(historyPage + 1, true);
    }
  }, [
    showHistory,
    keyword,
    hasMoreHistory,
    loadingHistory,
    historyPage,
    loadHistory,
  ]);

  useEffect(() => {
    ensureHistoryFilled();
  }, [searchHistory, ensureHistoryFilled]);

  return (
    <div className={`relative ${className}`}>
      <Search
        className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
        size={18}
      />
      <Input
        placeholder={placeholder}
        className="bg-border/50 h-10 w-full rounded-full border-none pl-10"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => {
          setShowHistory(true);
          if (searchHistory.length === 0) void loadHistory();
        }}
        onBlur={() => {
          setTimeout(() => setShowHistory(false), 100);
        }}
        onKeyDown={handleSearch}
      />

      {showHistory && !keyword.trim() && (
        <div className="absolute top-[110%] right-0 left-0 z-20 rounded-xl border bg-white shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            <span>Recent searches</span>
            {searchHistory.length > 0 && (
              <ActionButton
                type="button"
                variant="ghost"
                className="px-3 py-1 text-[11px] font-medium"
                disabled={clearingAll}
                onMouseDown={(e) => e.preventDefault()}
                onClick={async () => {
                  try {
                    setClearingAll(true);
                    await searchHistoryApi.clearAll();
                    setSearchHistory([]);
                    setHasMoreHistory(false);
                    setHistoryPage(1);
                  } catch (e) {
                    console.error('Failed to clear history', e);
                  } finally {
                    setClearingAll(false);
                  }
                }}
              >
                {clearingAll ? 'Clearing…' : 'Clear all'}
              </ActionButton>
            )}
          </div>
          <div
            className="max-h-64 overflow-y-auto"
            onScroll={(e) => {
              const el = e.currentTarget;
              if (!hasMoreHistory || loadingHistory) return;
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) {
                void loadHistory(historyPage + 1, true);
              }
            }}
            ref={historyListRef}
          >
            {searchHistory.length > 0 ? (
              searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left text-gray-800"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setKeyword(item.keyword);
                      setShowHistory(false);
                      navigate(
                        `/app/home/search?keyword=${encodeURIComponent(item.keyword)}`
                      );
                    }}
                  >
                    <span className="truncate font-medium">{item.keyword}</span>
                  </button>
                  <IconButton
                    type="button"
                    size="sm"
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    aria-label="Delete"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={async () => {
                      if (deletingId) return;
                      setDeletingId(item.id);
                      const prev = searchHistory;
                      setSearchHistory((list) =>
                        list.filter((h) => h.id !== item.id)
                      );
                      try {
                        await searchHistoryApi.deleteById(item.id);
                      } catch (e) {
                        console.error('Failed to delete history item', e);
                        setSearchHistory(prev);
                      } finally {
                        setDeletingId(null);
                        ensureHistoryFilled();
                      }
                    }}
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <span className="text-[11px]">…</span>
                    ) : (
                      <X size={14} />
                    )}
                  </IconButton>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                {loadingHistory ? 'Loading...' : 'No recent searches'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
