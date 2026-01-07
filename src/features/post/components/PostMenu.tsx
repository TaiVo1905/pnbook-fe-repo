interface PostMenuProps {
  isOwner: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export const PostMenu = ({
  isOwner,
  isDeleting,
  onEdit,
  onShare,
  onDelete,
}: PostMenuProps) => {
  return (
    <div className="relative">
      <div className="absolute top-2 right-4 z-10 rounded-lg border bg-white shadow-md">
        {isOwner && (
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={onEdit}
          >
            Edit post
          </button>
        )}
        <button
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          onClick={onShare}
        >
          Share
        </button>
        {isOwner && (
          <button
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            onClick={onDelete}
            disabled={isDeleting}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
