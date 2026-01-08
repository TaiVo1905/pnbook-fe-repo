import { memo } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/core/shadcn/components/ui/avatar';
import { cn } from '@/core/shadcn/utils/utils';

interface UserAvatarProps {
  name?: string;
  avatar?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
};

const defaultAvatarUrl = import.meta.env.VITE_AVATAR_DEFAULT_URL || '';

export const UserAvatar = memo(
  ({ name, avatar, className, size = 'md' }: UserAvatarProps) => (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatar ? (
        <AvatarImage src={avatar} alt={name} />
      ) : (
        <AvatarImage src={defaultAvatarUrl} alt={name} />
      )}
      <AvatarFallback>{name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
    </Avatar>
  )
);

UserAvatar.displayName = 'UserAvatar';
