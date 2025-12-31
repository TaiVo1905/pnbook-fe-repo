import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/core/shadcn/components/ui/button';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [text, setText] = useState('');
  const [hasImage, setHasImage] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="dark:bg-card animate-in zoom-in-95 w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-2xl duration-200">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Create a post</h2>
          <button
            onClick={onClose}
            className="hover:bg-accent text-muted-foreground rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border">
              <img
                src="https://github.com/shadcn.png"
                alt="User"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-[15px] font-semibold">Nguyễn Văn An</span>
          </div>

          <textarea
            placeholder="What do you think?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] w-full resize-none border-none bg-transparent text-lg outline-none focus:ring-0"
          />

          {hasImage && (
            <div className="group relative overflow-hidden rounded-lg border">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"
                alt="Upload preview"
                className="aspect-video w-1/3 object-cover"
              />
              <button
                onClick={() => setHasImage(false)}
                className="absolute top-2 left-[30%] -translate-x-full rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div
            onClick={() => setHasImage(true)}
            className="hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <span className="text-foreground/80 text-[14px] font-medium">
              Add images/videos
            </span>
            <ImageIcon className="text-green-500" size={24} />
          </div>

          <Button
            className={`h-11 w-full rounded-lg font-semibold text-white transition-all ${
              text.trim() || hasImage
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-200'
            }`}
            disabled={!text.trim() && !hasImage}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
