import { useState, useRef, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/core/shadcn/components/ui/button';
import { postApi } from '../services/post.api';
import { toast } from 'sonner';
import type {
  ApiError,
  CreatePostAttachment,
  CreatePostModalProps,
  CreatePostPayload,
  UploadedAttachment,
} from '../types/post.type';

export const CreatePostModal = ({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<CreatePostAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    setAttachments((prev) => [
      ...prev,
      ...selectedFiles.map((file) => {
        const isVideo = file.type.startsWith('video/');
        const attachmentUrl = URL.createObjectURL(file);

        return {
          key: crypto.randomUUID(),
          attachmentUrl,
          type: isVideo ? 'video' : 'image',
          file,
          mimeType: file.type || 'application/octet-stream',
        } satisfies CreatePostAttachment;
      }),
    ]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeAttachment = useCallback((key: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.key === key);
      if (target) {
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
          headers: {
            'Content-Type': attachment.mimeType,
          },
          body: attachment.file,
        });

        if (!uploadRes.ok) {
          throw new Error(`Failed to upload ${attachment.file.name}`);
        }

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

  const handlePost = useCallback(async () => {
    if (!text.trim() && attachments.length === 0) return;

    setIsSubmitting(true);
    try {
      const uploadedAttachments = await uploadAttachments();

      const payload: CreatePostPayload = {
        content: text,
        attachments: uploadedAttachments,
      };

      const res = await postApi.createPost(payload);

      if (res.statusCode === 201 || res.statusCode === 200) {
        toast.success('Post published successfully!');
        setText('');
        setAttachments((prev) => {
          prev.forEach((item) => URL.revokeObjectURL(item.attachmentUrl));
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
  }, [text, attachments, uploadAttachments, onClose, onPostCreated]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 dark:bg-card w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Create post</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent cursor-pointer rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] w-full resize-none border-none bg-transparent text-lg outline-none"
            disabled={isSubmitting}
          />

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
                ) : (
                  <img
                    src={file.attachmentUrl}
                    className="h-full w-full object-cover"
                    alt="Preview"
                  />
                )}
                <button
                  onClick={() => removeAttachment(file.key)}
                  className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <span className="text-[14px] font-medium">Add photo/video</span>
            <ImageIcon className="text-green-500" size={24} />
          </div>

          <Button
            onClick={handlePost}
            disabled={
              (!text.trim() && attachments.length === 0) || isSubmitting
            }
            className="h-11 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Post'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
