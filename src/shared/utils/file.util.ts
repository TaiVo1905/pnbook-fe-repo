import { postApi } from '@/features/post/services/post.api';

export interface UploadOptions {
  filename: string;
  mimeType: string;
  file: File;
}

export const uploadFileToS3 = async ({
  filename,
  mimeType,
  file,
}: UploadOptions): Promise<{ key: string; url: string }> => {
  const response = await postApi.getPresignedUrl({
    filename: `public/${filename}`,
    mimeType,
  });

  const { key, url } = response.data;

  const uploadRes = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`Failed to upload ${filename}`);
  }

  const s3BaseUrl = import.meta.env.VITE_S3_BASE_URL;
  const uploadedUrl = `${s3BaseUrl}/${key}`;

  return { key, url: uploadedUrl };
};

export interface AttachmentToUpload {
  key: string;
  attachmentUrl?: string;
  type: 'image' | 'video' | 'audio';
  file?: File;
  mimeType?: string;
}

export interface UploadedAttachment {
  key: string;
  attachmentUrl: string;
  type: 'image' | 'video' | 'audio';
}

export const uploadAttachments = async (
  attachments: AttachmentToUpload[]
): Promise<UploadedAttachment[]> => {
  if (attachments.length === 0) return [];

  return Promise.all(
    attachments.map(async (attachment) => {
      if (!attachment.file || !attachment.mimeType) {
        return {
          key: attachment.key,
          attachmentUrl: attachment.attachmentUrl || '',
          type: attachment.type,
        };
      }

      const { key, url: uploadedUrl } = await uploadFileToS3({
        filename: attachment.file.name,
        mimeType: attachment.mimeType,
        file: attachment.file,
      });

      return {
        key,
        attachmentUrl: uploadedUrl,
        type: attachment.type,
      };
    })
  );
};
