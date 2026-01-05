import React from 'react';
import { Image as ImageIcon, SendHorizontal, Loader2 } from 'lucide-react';

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
      <label className="cursor-pointer rounded-full p-2 text-blue-500 transition-colors hover:bg-gray-100">
        {isUploading ? (
          <Loader2 className="animate-spin" size={22} />
        ) : (
          <ImageIcon size={22} />
        )}
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
        className="flex-1 rounded-full bg-gray-100 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-400/50"
        placeholder="Type a message..."
      />
      <button
        onClick={onSendText}
        className="rounded-full p-2 text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-30"
        disabled={!input.trim()}
      >
        <SendHorizontal size={22} />
      </button>
    </div>
  );
};
