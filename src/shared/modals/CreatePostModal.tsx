import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { postApi } from '@/features/post/services/post.api';
import { toast } from 'sonner';
import { FileUploadButton } from '../components/post/FileUploadButton';
import { AttachmentPreview } from '../components/post/AttachmentPreview';
import { generateUUID } from '@/shared/utils/uuid.util';
import { uploadAttachments } from '@/shared/utils/file.util';
import { IconButton } from '@/shared/components/IconButton';
import { ActionButton } from '@/shared/components/ActionButton';
import type {
  ApiError,
  CreatePostAttachment,
  CreatePostModalProps,
  CreatePostPayload,
} from '@/shared/types/post.type';

export const CreatePostModal = ({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<CreatePostAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (target?.attachmentUrl) {
        URL.revokeObjectURL(target.attachmentUrl);
      }
      return prev.filter((item) => item.key !== key);
    });
  }, []);

  const handlePost = useCallback(async () => {
    if (!text.trim() && attachments.length === 0) return;

    setIsSubmitting(true);
    try {
      const uploadedAttachments = await uploadAttachments(attachments);

      const payload: CreatePostPayload = {
        content: text,
        attachments: uploadedAttachments,
      };

      const res = await postApi.createPost(payload);

      if (res.statusCode === 201 || res.statusCode === 200) {
        toast.success('Post published successfully!');
        setText('');
        setAttachments((prev) => {
          prev.forEach((item) => {
            if (item.attachmentUrl) {
              URL.revokeObjectURL(item.attachmentUrl);
            }
          });
          return [];
        });
        onClose();
        onPostCreated?.();
      } else {
        toast.error(res.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as ApiError).message === 'string'
      ) {
        toast.error((error as ApiError).message);
        return;
      }

      toast.error('System error');
    } finally {
      setIsSubmitting(false);
    }
  }, [text, attachments, onClose, onPostCreated]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 dark:bg-card w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Create post</h2>
          <IconButton onClick={onClose} variant="ghost">
            <X size={20} />
          </IconButton>
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] w-full resize-none border-none bg-transparent text-lg outline-none"
            disabled={isSubmitting}
          />

          <AttachmentPreview
            attachments={attachments}
            onRemove={removeAttachment}
          />

          <FileUploadButton
            onFilesSelected={handleFilesSelected}
            disabled={isSubmitting}
          />

          <ActionButton
            onClick={handlePost}
            disabled={!text.trim() && attachments.length === 0}
            loading={isSubmitting}
            variant="primary"
            fullWidth
          >
            Post
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
