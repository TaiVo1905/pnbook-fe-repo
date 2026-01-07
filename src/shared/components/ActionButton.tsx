import { memo, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/core/shadcn/utils/utils';
import { Loader2 } from 'lucide-react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  className?: string;
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  ghost: 'text-gray-700 hover:bg-gray-100',
};

export const ActionButton = memo(
  ({
    children,
    loading = false,
    variant = 'primary',
    fullWidth = false,
    className,
    disabled,
    ...props
  }: ActionButtonProps) => (
    <button
      className={cn(
        'cursor-pointer rounded-lg px-4 py-2 font-semibold transition-colors',
        variantStyles[variant],
        fullWidth && 'w-full',
        (disabled || loading) && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  )
);

ActionButton.displayName = 'ActionButton';
