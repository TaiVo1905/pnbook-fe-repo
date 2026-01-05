import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postApi } from '../services/post.api';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/core/shadcn/components/ui/avatar';
import { Button } from '@/core/shadcn/components/ui/button';
import { toast } from 'sonner';
import PostLayout from '../layouts/PostLayout';

interface UserSearch {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [results, setResults] = useState<UserSearch[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const response = await postApi.searchUsers(keyword);
      if (response.statusCode === 200) {
        setResults(response.data);
      } else {
        toast.error(response.message || 'Search failed');
      }
    } catch {
      toast.error('Server connection error');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <PostLayout>
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">Results for: "{keyword}"</h2>

        {loading ? (
          <div className="py-10 text-center">Searching...</div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((user) => (
              <div
                key={user.id}
                className="hover:bg-accent/50 flex items-center justify-between rounded-lg border-b p-3 transition-colors last:border-0"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-[15px] font-semibold">{user.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-5"
                >
                  View profile
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-10 text-center">
            No matching results found.
          </div>
        )}
      </div>
    </PostLayout>
  );
};
