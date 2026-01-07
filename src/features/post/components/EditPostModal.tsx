import { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { postApi } from '../services/post.api';
import { toast } from 'sonner';
import { FileUploadButton } from './FileUploadButton';
import { AttachmentPreview } from './AttachmentPreview';
import { generateUUID } from '@/shared/utils/uuid.util';
import { uploadAttachments } from '@/shared/utils/file.util';
import { IconButton } from '@/shared/components/IconButton';
import { ActionButton } from '@/shared/components/ActionButton';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { ImageGallery } from './ImageGallery';
import { formatRelativeTime } from '@/shared/utils/date.util';
import type {
  Attachment,
  CreatePostAttachment,
  Post,
} from '../types/post.type';

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  initialContent: string;
  initialAttachments: Attachment[];
  originalPost?: Post | null;
  onUpdated: (payload: { content: string; attachments: Attachment[] }) => void;
}

export const EditPostModal = ({
  isOpen,
  onClose,
  postId,
  initialContent,
  initialAttachments,
  originalPost,
  onUpdated,
}: EditPostModalProps) => {
  const [text, setText] = useState(initialContent);
  const [attachments, setAttachments] = useState<CreatePostAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setText(initialContent);
    setAttachments(
      initialAttachments.map((a) => ({
        key: a.id,
        attachmentUrl: a.attachmentUrl,
        type: a.attachmentType,
      }))
    );
  }, [initialContent, initialAttachments]);

  const handleFilesSelected = useCallback((files: File[]) => {
    setAttachments((prev) => [
      ...prev,
      ...files.map((file) => {
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        const attachmentUrl = URL.createObjectURL(file);
        return {
          key: generateUUID(),
          attachmentUrl,
          type: isVideo ? 'video' : isAudio ? 'audio' : 'image',
          file,
          mimeType: file.type || 'application/octet-stream',
        } satisfies CreatePostAttachment;
      }),
    ]);
  }, []);

  const removeAttachment = useCallback((key: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.key === key);
      if (target?.attachmentUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(target.attachmentUrl);
      }
      return prev.filter((item) => item.key !== key);
    });
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!text.trim() && attachments.length === 0) return;
    setIsSubmitting(true);
    try {
      const uploaded = await uploadAttachments(attachments);
      const res = await postApi.updatePost(postId, {
        content: text,
        attachments: uploaded,
      });
      if (res.statusCode === 200) {
        toast.success('Post updated');
        const updated = res.data;
        onUpdated({
          content: updated.content,
          attachments: updated.attachments || [],
        });
        setAttachments((prev) => {
          prev.forEach((item) => {
            if (item.attachmentUrl?.startsWith('blob:'))
              URL.revokeObjectURL(item.attachmentUrl);
          });
          return prev;
        });
        onClose();
      } else {
        toast.error(res.message || 'Failed to update post');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update post'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [attachments, onClose, onUpdated, postId, text]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 dark:bg-card w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Edit post</h2>
          <IconButton
            onClick={onClose}
            disabled={isSubmitting}
            variant="default"
          >
            <X size={20} />
          </IconButton>
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
          <textarea
            placeholder="Update your post"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] w-full resize-none border-none bg-transparent text-lg outline-none"
            disabled={isSubmitting}
          />

          {originalPost && (
            <div className="bg-muted/40 space-y-2 rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={originalPost.poster.name}
                  avatar={originalPost.poster.avatarUrl}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {originalPost.poster.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatRelativeTime(originalPost.createdAt)}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {originalPost.content}
              </p>

              {originalPost.attachments.length > 0 && (
                <ImageGallery attachments={originalPost.attachments} />
              )}
            </div>
          )}

          <AttachmentPreview
            attachments={attachments}
            onRemove={removeAttachment}
          />

          {!originalPost && (
            <FileUploadButton
              onFilesSelected={handleFilesSelected}
              label="Add media"
              disabled={isSubmitting}
            />
          )}

          <ActionButton
            onClick={handleUpdate}
            disabled={!text.trim() && attachments.length === 0}
            loading={isSubmitting}
            variant="primary"
            fullWidth
          >
            Update
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
