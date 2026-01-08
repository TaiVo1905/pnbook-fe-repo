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
  const menuItems = [
    ...(isOwner ? [{ label: 'Edit post', action: onEdit, className: '' }] : []),
    { label: 'Share', action: onShare, className: '' },
    ...(isOwner
      ? [
          {
            label: 'Delete',
            action: onDelete,
            className: 'text-red-600',
            disabled: isDeleting,
          },
        ]
      : []),
  ];

  return (
    <div className="relative">
      <div className="absolute top-1 right-4 z-10 rounded-lg border bg-white shadow-md">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${item.className}`}
            onClick={item.action}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
