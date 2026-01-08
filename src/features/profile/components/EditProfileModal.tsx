import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { profileApi } from '../services/profile.api';
import { toast } from 'sonner';
import { FileUploadButton } from '@/shared/components/post/FileUploadButton';
import { uploadFileToS3 } from '@/shared/utils/file.util';
import { IconButton } from '@/shared/components/IconButton';
import { ActionButton } from '@/shared/components/ActionButton';
import type {
  UserProfileDetail,
  UserWithFriendStatus,
} from '../types/profile.type';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileDetail | UserWithFriendStatus;
  onUpdated: (user: UserWithFriendStatus) => void;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  user,
  onUpdated,
}: EditProfileModalProps) => {
  const [name, setName] = useState(user.name);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      let avatarUrl = user.avatarUrl;

      if (avatarFile) {
        const { url: uploadedUrl } = await uploadFileToS3({
          filename: `avatar-${Date.now()}.${avatarFile.name.split('.').pop()}`,
          mimeType: avatarFile.type,
          file: avatarFile,
        });
        avatarUrl = uploadedUrl;
      }

      const res = await profileApi.updateProfile({
        name: name.trim(),
        avatarUrl,
      });

      if (res.data) {
        const updated: UserWithFriendStatus =
          'friendshipStatus' in user
            ? { ...user, ...res.data }
            : {
                ...res.data,
                friendshipStatus: 'none',
                isFriend: false,
                requestSentByMe: false,
              };
        onUpdated(updated);
        toast.success('Profile updated successfully');
        onClose();
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [name, avatarFile, user.avatarUrl, onUpdated, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-in zoom-in-95 dark:bg-card w-full max-w-[500px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">Edit Profile</h2>
          <IconButton
            onClick={onClose}
            disabled={isSubmitting}
            variant="default"
          >
            <X size={20} />
          </IconButton>
        </div>

        <div className="max-h-[80vh] space-y-4 overflow-y-auto p-4">
          <div className="flex justify-center">
            <div className="relative h-32 w-32">
              <img
                src={avatarPreview || 'https://github.com/shadcn.png'}
                alt="Avatar preview"
                className="h-full w-full rounded-full border-2 border-gray-200 object-cover"
              />
            </div>
          </div>

          <FileUploadButton
            onFilesSelected={handleAvatarSelect}
            label="Change Avatar"
            disabled={isSubmitting}
            accept="image/*"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <ActionButton
            onClick={handleUpdate}
            loading={isSubmitting}
            variant="primary"
            fullWidth
          >
            Update Profile
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
