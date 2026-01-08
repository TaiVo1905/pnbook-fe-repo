import { X } from 'lucide-react';
import type { CreatePostAttachment } from '@/shared/types/post.type';

interface AttachmentPreviewProps {
  attachments: CreatePostAttachment[];
  onRemove: (key: string) => void;
}

export const AttachmentPreview = ({
  attachments,
  onRemove,
}: AttachmentPreviewProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {attachments.map((file) => (
        <div
          key={file.key}
          className="group relative aspect-video overflow-hidden rounded-lg border"
        >
          {file.type === 'video' ? (
            <video
              src={file.attachmentUrl}
              className="h-full w-full object-cover"
            />
          ) : file.type === 'audio' ? (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 p-2">
              <audio src={file.attachmentUrl} controls className="w-full" />
            </div>
          ) : (
            <img
              src={file.attachmentUrl}
              className="h-full w-full object-cover"
              alt="Preview"
            />
          )}
          <button
            onClick={() => onRemove(file.key)}
            className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
