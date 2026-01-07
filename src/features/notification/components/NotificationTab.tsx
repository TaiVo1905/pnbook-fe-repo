interface TabsProps {
  activeTab: "all" | "unread";
  onTabChange: (tab: "all" | "unread") => void;
  unreadCount: number;
}

export const NotificationTabs = ({ activeTab, onTabChange, unreadCount }: TabsProps) => {
  return (
    <div className=" flex gap-10 mb-8 border-b border-gray-100">
      {(["all", "unread"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`cursor-pointer pb-4 text-sm font-bold capitalize relative transition-all ${
            activeTab === tab ? "text-orange-500" : "text-gray-400"
          }`}
        >
          {tab === "all" ? "ALL" : "Unread"}
          {tab === "unread" && unreadCount > 0 && (
            <span className="absolute -top-1 -right-6 bg-orange-500 text-white text-[10px] min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-300">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};