import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Home,
  Bell,
  Users,
  MessageCircle,
  User,
  LogOut,
  Search,
  Moon,
  Settings,
} from 'lucide-react';
import { Input } from '@/core/shadcn/components/ui/input';
import { useState, useCallback, type KeyboardEvent } from 'react';
import { SidebarItem } from '@/core/components/SidebarItem';
import { IconButton } from '@/shared/components/IconButton';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { userApi, type UserProfile } from '@/core/api/user.api';

export const PrivateLayout = () => {
  const [keyword, setKeyword] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, loading } = useSignOut();

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await userApi.getCurrentUser();
        if (response?.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Failed to load current user:', error);
      }
    };
    loadCurrentUser();
  }, []);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleSearch = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && keyword.trim()) {
        e.preventDefault();
        navigate(
          `/app/home/search?keyword=${encodeURIComponent(keyword.trim())}`
        );
      }
    },
    [keyword, navigate]
  );

  return (
    <div className="bg-background text-foreground flex min-h-screen font-sans">
      <aside className="bg-card fixed top-0 left-0 flex h-full w-64 flex-col border-r py-6">
        <div className="mb-10 px-6">
          <h1 className="text-primary text-2xl font-bold">PnBook</h1>
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarItem
            icon={Home}
            label="Home"
            to="/app/home"
            active={isActive('/app/home')}
          />
          <SidebarItem
            icon={Bell}
            label="Notifications"
            to="/app/notifications"
            active={isActive('/app/notifications')}
          />
          <SidebarItem
            icon={Users}
            label="Friends"
            to="/app/friends"
            active={isActive('/app/friends')}
          />
          <SidebarItem
            icon={MessageCircle}
            label="Messages"
            to="/app/messages"
            active={isActive('/app/messages')}
          />
          <SidebarItem
            icon={User}
            label="Profile"
            to="/app/profile"
            active={isActive('/app/profile')}
          />
        </nav>
        <div className="mt-auto border-t pt-4">
          <button
            onClick={() => signOut()}
            disabled={loading}
            className="hover:text-foreground flex w-full cursor-pointer items-center gap-4 px-6 py-3 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={22} />
            <span className="text-[15px]">
              {loading ? 'Signing out...' : 'Log Out'}
            </span>
          </button>
        </div>
      </aside>

      <div className="ml-64 flex flex-1 flex-col">
        <header className="bg-card sticky top-0 z-10 flex h-16 items-center border-b px-8">
          <div className="flex-1" />
          <div className="relative mx-auto w-full max-w-2xl">
            <Search
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
              size={18}
            />
            <Input
              placeholder="Search for creators..."
              className="bg-border/50 h-10 w-full rounded-full border-none pl-10"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <IconButton variant="default">
              <Moon size={20} />
            </IconButton>
            <IconButton variant="default">
              <Settings size={20} />
            </IconButton>
            <div className="ml-2 h-9 w-9 overflow-hidden rounded-full border">
              <img
                src={currentUser?.avatarUrl || 'https://github.com/shadcn.png'}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex flex-1 justify-center overflow-y-scroll p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
