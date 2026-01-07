import { memo, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/core/shadcn/utils/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  default: 'hover:bg-gray-100',
  ghost: 'hover:bg-accent',
  danger: 'hover:bg-red-50 text-red-600',
};

const sizeStyles = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3',
};

export const IconButton = memo(
  ({
    children,
    variant = 'default',
    size = 'md',
    className,
    disabled,
    ...props
  }: IconButtonProps) => (
    <button
      className={cn(
        'cursor-pointer rounded-full transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
);

IconButton.displayName = 'IconButton';
