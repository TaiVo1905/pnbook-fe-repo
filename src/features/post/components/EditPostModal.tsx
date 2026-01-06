import { useState, useCallback, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/core/shadcn/components/ui/button';
import { postApi } from '../services/post.api';
import { toast } from 'sonner';
import { FileUploadButton } from './FileUploadButton';
import { AttachmentPreview } from './AttachmentPreview';
import type {
  Attachment,
  CreatePostAttachment,
  UploadedAttachment,
} from '../types/post.type';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  initialContent: string;
  initialAttachments: Attachment[];
  onUpdated: (payload: { content: string; attachments: Attachment[] }) => void;
}

export const EditPostModal = ({
  isOpen,
  onClose,
  postId,
  initialContent,
  initialAttachments,
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
          key: self.crypto.randomUUID(),
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

  const uploadAttachments = useCallback(async (): Promise<
    UploadedAttachment[]
  > => {
    if (attachments.length === 0) return [];

    return Promise.all(
      attachments.map(async (attachment) => {
        if (!attachment.file || !attachment.mimeType) {
          return {
            key: attachment.key,
            attachmentUrl: attachment.attachmentUrl,
            type: attachment.type,
          } satisfies UploadedAttachment;
        }

        const response = await postApi.getPresignedUrl({
          filename: `public/${attachment.file.name}`,
          mimeType: attachment.mimeType,
        });

        const { key, url } = response.data;
        const uploadRes = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': attachment.mimeType },
          body: attachment.file,
        });
        if (!uploadRes.ok)
          throw new Error(`Failed to upload ${attachment.file.name}`);

        const s3BaseUrl = import.meta.env.VITE_S3_BASE_URL;
        const uploadedUrl = `${s3BaseUrl}/${key}`;
        return {
          key,
          attachmentUrl: uploadedUrl,
          type: attachment.type,
        } satisfies UploadedAttachment;
      })
    );
  }, [attachments]);

  const handleUpdate = useCallback(async () => {
    if (!text.trim() && attachments.length === 0) return;
    setIsSubmitting(true);
    try {
      const uploaded = await uploadAttachments();
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
  }, [attachments, onClose, onUpdated, postId, text, uploadAttachments]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 dark:bg-card w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Edit post</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent cursor-pointer rounded-full p-1"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
          <textarea
            placeholder="Update your post"
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
            label="Add media"
            disabled={isSubmitting}
          />

          <Button
            onClick={handleUpdate}
            disabled={
              (!text.trim() && attachments.length === 0) || isSubmitting
            }
            className="h-11 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
