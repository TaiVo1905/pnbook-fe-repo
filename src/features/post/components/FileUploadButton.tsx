import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface FileUploadButtonProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  label?: string;
  disabled?: boolean;
}

export const FileUploadButton = ({
  onFilesSelected,
  accept = 'image/*,video/*,audio/*',
  label = 'Add photo/video/audio',
  disabled = false,
}: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onFilesSelected(Array.from(files));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        disabled={disabled}
      />
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-100 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <span className="text-[14px] font-medium">{label}</span>
        <ImageIcon className="text-green-500" size={24} />
      </div>
    </>
  );
};
