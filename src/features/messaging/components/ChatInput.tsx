import React from 'react';
import { Image as ImageIcon, SendHorizontal, Loader2 } from 'lucide-react';
import { IconButton } from '@/shared/components/IconButton';

interface ChatInputProps {
  input: string;
  isUploading: boolean;
  onInputChange: (value: string) => void;
  onSendText: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ChatInput = ({
  input,
  isUploading,
  onInputChange,
  onSendText,
  onImageChange,
}: ChatInputProps) => {
  return (
    <div className="flex items-center gap-3 border-t bg-white p-4">
      <label className="cursor-pointer">
        <IconButton
          variant="default"
          className="text-blue-500"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <ImageIcon size={22} />
          )}
        </IconButton>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
          disabled={isUploading}
        />
      </label>
      <input
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSendText()}
        className="flex-1 rounded-full bg-gray-100 px-4 py-2 transition-all outline-none"
        placeholder="Type a message..."
      />
      <IconButton
        onClick={onSendText}
        className="text-blue-600"
        disabled={!input.trim()}
        variant="default"
      >
        <SendHorizontal size={22} />
      </IconButton>
    </div>
  );
};
