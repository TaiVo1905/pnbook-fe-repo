import { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { httpClient } from '@/core/api/httpClient.api';

interface ChatImageProps {
  src: string;
  onLoaded: () => void;
}

export const ChatImage = ({ src, onLoaded }: ChatImageProps) => {
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLimitedTimeUrl = async () => {
      try {
        if (src.startsWith('http://') || src.startsWith('https://')) {
          setImageUrl(src);
          setLoading(false);
          return;
        }

        const data = await httpClient.post<{ data: { url: string } }>(
          '/get-limited-time-url',
          { key: src }
        );

        if (data?.data?.url) {
          setImageUrl(data.data.url);
        } else {
          setError(true);
        }
      } catch (_err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLimitedTimeUrl();
  }, [src]);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-gray-100 p-8">
        <Loader2 size={20} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-4 text-xs text-gray-400 italic">
        <ImageIcon size={20} className="mb-1 opacity-20" />
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      className="block h-auto max-h-[300px] max-w-full min-w-[150px] rounded-lg object-cover shadow-sm"
      alt="attachment"
      onLoad={onLoaded}
      onError={() => setError(true)}
    />
  );
};
