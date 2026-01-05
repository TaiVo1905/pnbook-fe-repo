import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ChatImageProps {
  src: string;
  onLoaded: () => void;
}

export const ChatImage = ({ src, onLoaded }: ChatImageProps) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-4 text-xs text-gray-400 italic">
        <ImageIcon size={20} className="mb-1 opacity-20" />
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      className="block h-auto max-h-[300px] max-w-full min-w-[150px] rounded-lg object-cover shadow-sm"
      alt="attachment"
      onLoad={onLoaded}
      onError={() => setError(true)}
    />
  );
};
