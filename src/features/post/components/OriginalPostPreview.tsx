import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../types/post.type';
import { ImageGallery } from './ImageGallery';

interface OriginalPostPreviewProps {
  originalPost: Post;
}

export const OriginalPostPreview = ({
  originalPost,
}: OriginalPostPreviewProps) => {
  return (
    <div className="bg-muted/40 mt-4 rounded-xl border p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-pink-100">
          {originalPost.poster?.avatarUrl ? (
            <img
              src={originalPost.poster.avatarUrl}
              alt={originalPost.poster.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-pink-600">
              {originalPost.poster?.name?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        <div>
          <h4 className="">{originalPost.poster?.name || 'User'}</h4>
          <span className="flex text-[12px] font-normal">
            {formatDistanceToNow(new Date(originalPost.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
      <p className="mb-2 overflow-clip text-sm break-words overflow-ellipsis whitespace-pre-line">
        {originalPost.content}
      </p>
      {originalPost.attachments && originalPost.attachments.length > 0 && (
        <ImageGallery attachments={originalPost.attachments} />
      )}
    </div>
  );
};
