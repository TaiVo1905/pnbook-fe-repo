import { useState, type MouseEvent } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/core/shadcn/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/core/shadcn/components/ui/dialog';
import type { Post, PostActionProps, Attachment } from '../types/post.type';
import { cn } from '@/core/shadcn/utils/utils';

export const PostCard = ({ post }: { post: Post }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const timeAgo = new Date(post.createdAt).toLocaleDateString();
  const attachments = post.attachments || [];

  const handleOpenLightbox = (index: number) => {
    if (attachments[index].attachmentType === 'image') {
      setSelectedImageIndex(index);
    }
  };

  const handlePrev = (e: MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev! > 0 ? prev! - 1 : attachments.length - 1
      );
    }
  };

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) =>
        prev! < attachments.length - 1 ? prev! + 1 : 0
      );
    }
  };

  const renderMedia = (item: Attachment, index: number, className?: string) => {
    const isVideo = item.attachmentType === 'video';

    return (
      <div
        key={item.id}
        className={cn('relative cursor-pointer overflow-hidden', className)}
        onClick={() => handleOpenLightbox(index)}
      >
        {isVideo ? (
          <video
            src={item.attachmentUrl}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={item.attachmentUrl}
            alt="Post content"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    );
  };

  const renderGallery = () => {
    const count = attachments.length;
    if (count === 0) return null;

    return (
      <div
        className={cn(
          'grid gap-1 overflow-hidden rounded-lg',
          count === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}
      >
        {count === 1 && renderMedia(attachments[0], 0, 'max-h-[500px]')}
        {count === 2 &&
          attachments.map((item, i) => renderMedia(item, i, 'aspect-square'))}
        {count === 3 && (
          <>
            <div className="row-span-2">
              {renderMedia(attachments[0], 0, 'h-full min-h-[300px]')}
            </div>
            <div className="grid grid-rows-2 gap-1">
              {renderMedia(attachments[1], 1, 'h-full')}
              {renderMedia(attachments[2], 2, 'h-full')}
            </div>
          </>
        )}
        {count >= 4 && (
          <>
            {attachments
              .slice(0, 3)
              .map((item, i) => renderMedia(item, i, 'aspect-square'))}
            <div
              className="relative aspect-square"
              onClick={() => handleOpenLightbox(3)}
            >
              {renderMedia(attachments[3], 3, 'h-full w-full')}
              {count > 4 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-bold text-white">
                  +{count - 4}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="flex items-start justify-between p-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-pink-100">
            {post.user?.avatar ? (
              <img
                src={post.user.avatar}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-bold text-pink-600">U</span>
            )}
          </div>
          <div>
            <h4 className="text-[15px] font-bold">
              {post.user?.name || 'Anonymous User'}
            </h4>
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      <div className="px-4 pb-4">
        <p className="mb-4 text-[15px]">{post.content}</p>
        {renderGallery()}
      </div>

      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:max-w-[90vw]">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative flex h-full min-h-[50vh] items-center justify-center">
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>

            {attachments.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 z-50 rounded-full bg-black/20 p-2 text-white hover:bg-black/50"
              >
                <ChevronLeft size={40} />
              </button>
            )}

            {selectedImageIndex !== null && (
              <img
                src={attachments[selectedImageIndex].attachmentUrl}
                className="max-h-[85vh] w-auto object-contain shadow-2xl"
                alt="Original size"
              />
            )}

            {attachments.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 z-50 rounded-full bg-black/20 p-2 text-white hover:bg-black/50"
              >
                <ChevronRight size={40} />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between border-t px-4 py-1">
        <PostAction icon={ThumbsUp} label="Like" />
        <PostAction icon={MessageSquare} label="Comment" />
        <PostAction icon={Share2} label="Share" />
      </div>
    </div>
  );
};

const PostAction = ({ icon: Icon, label, onClick }: PostActionProps) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className="text-foreground/70 flex-1 gap-2 py-5"
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </Button>
);
