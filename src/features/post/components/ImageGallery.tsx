import { memo, useState, type MouseEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/core/shadcn/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/core/shadcn/utils/utils';
import type { Attachment } from '../types/post.type';

interface ImageGalleryProps {
  attachments: Attachment[];
}

export const ImageGallery = memo(({ attachments }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

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

  const count = attachments.length;
  if (count === 0) return null;

  return (
    <>
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

      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:max-w-[90vw]">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative flex h-full min-h-[50vh] items-center justify-center">
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute -top-10 right-0 cursor-pointer text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>

            {attachments.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 z-50 cursor-pointer rounded-full bg-black/20 p-2 text-white hover:bg-black/50"
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
                className="absolute right-4 z-50 cursor-pointer rounded-full bg-black/20 p-2 text-white hover:bg-black/50"
              >
                <ChevronRight size={40} />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
ImageGallery.displayName = 'ImageGallery';
