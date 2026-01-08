import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '';

  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: vi,
  });
};
