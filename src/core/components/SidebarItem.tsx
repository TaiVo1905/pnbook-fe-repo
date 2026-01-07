import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  active?: boolean;
}

export const SidebarItem = memo(
  ({ icon: Icon, label, to, active = false }: SidebarItemProps) => (
    <Link
      to={to}
      className={`flex items-center gap-4 px-6 py-3 transition-colors ${
        active
          ? 'text-primary font-semibold'
          : 'hover:text-foreground text-gray-500 hover:bg-gray-100'
      }`}
    >
      <Icon size={22} className={active ? 'text-primary' : ''} />
      <span className="text-[15px]">{label}</span>
    </Link>
  )
);

SidebarItem.displayName = 'SidebarItem';
