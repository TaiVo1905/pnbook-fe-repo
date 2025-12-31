import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import { Button } from '@/core/shadcn/components/ui/button';
import { useState, type KeyboardEvent } from 'react';
import type { SidebarItemProps } from '@/features/post/types/post.type';

const SidebarItem = ({
  icon: Icon,
  label,
  to,
  active = false,
}: SidebarItemProps) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-6 py-3 transition-colors ${
      active
        ? 'text-primary font-semibold'
        : 'text-foreground/70 hover:bg-accent'
    }`}
  >
    <Icon size={22} className={active ? 'text-primary' : ''} />
    <span className="text-[15px]">{label}</span>
  </Link>
);

export const PrivateLayout = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keyword.trim()) {
      e.preventDefault();
      navigate(
        `/app/home/search?keyword=${encodeURIComponent(keyword.trim())}`
      );
    }
  };

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
            onClick={() => navigate('/sign-in')}
            className="text-foreground/70 hover:bg-accent flex w-full items-center gap-4 px-6 py-3 transition-colors"
          >
            <LogOut size={22} />
            <span className="text-[15px]">Log Out</span>
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
            <Button variant="ghost" size="icon" className="rounded-full">
              <Moon size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings size={20} />
            </Button>
            <div className="ml-2 h-9 w-9 overflow-hidden rounded-full border">
              <img
                src="https://github.com/shadcn.png"
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex flex-1 justify-center overflow-y-auto p-6">
          <div className="w-full max-w-2xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
