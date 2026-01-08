import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { IconButton } from '@/shared/components/IconButton';
import { ActionButton } from '@/shared/components/ActionButton';
import { ImageGallery } from '../components/post/ImageGallery';
import type { Post } from '@/shared/types/post.type';
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
    setSubmitting(true);
    try {
      await onShare(content || '  ');
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
          <IconButton
            onClick={onClose}
            disabled={submitting}
            variant="default"
            className="hover:bg-gray-100"
          >
            <X size={20} />
          </IconButton>
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
              <div className="">
                <h4 className="font-bold">{post.poster?.name || 'User'}</h4>
                <span className="text-muted-foreground flex text-[12px] font-normal">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <p className="text-foreground/90 mb-3 overflow-clip text-[14px] break-words overflow-ellipsis whitespace-pre-line">
              {post.content}
            </p>
            <ImageGallery attachments={post.attachments || []} />
          </div>

          <ActionButton
            onClick={handleShare}
            disabled={submitting}
            loading={submitting}
            variant="primary"
            fullWidth
          >
            Share
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
