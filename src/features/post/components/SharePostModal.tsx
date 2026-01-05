import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/core/shadcn/components/ui/button';
import { toast } from 'sonner';
import type { Post } from '../types/post.type';
import { ImageGallery } from './ImageGallery';
import { formatDistanceToNow } from 'date-fns';

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onShare: (content: string) => Promise<void>;
}

export const SharePostModal = ({
  isOpen,
  onClose,
  post,
  onShare,
}: SharePostModalProps) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    const content = text.trim();
    if (!content) return;
    setSubmitting(true);
    try {
      await onShare(content);
      setText('');
      onClose();
      toast.success('Shared post');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to share post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="dark:bg-card w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Share post</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent cursor-pointer rounded-full p-1"
            disabled={submitting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
          <textarea
            placeholder="Add your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] w-full resize-none border-none bg-transparent text-lg outline-none"
            disabled={submitting}
          />

          <div className="bg-muted/40 rounded-xl border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-pink-100">
                {post.poster?.avatarUrl ? (
                  <img
                    src={post.poster.avatarUrl}
                    alt={post.poster.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-pink-600">
                    {post.poster?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span>{post.poster?.name || 'User'}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <p className="text-foreground/90 mb-3 text-[14px]">
              {post.content}
            </p>
            <ImageGallery attachments={post.attachments || []} />
          </div>

          <Button
            onClick={handleShare}
            disabled={submitting || !text.trim()}
            className="h-11 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
          >
            {submitting ? 'Sharing...' : 'Share'}
          </Button>
        </div>
      </div>
    </div>
  );
};
