import { ActionButton } from '@/shared/components/ActionButton';
import type { SearchTab } from '../types/search.type';

interface SearchResultTabsProps {
  keyword: string;
  activeTab: SearchTab;
  onChange: (tab: SearchTab) => void;
}

const tabs: Array<{ key: SearchTab; label: string }> = [
  { key: 'users', label: 'Users' },
  { key: 'posts', label: 'Posts' },
];

export const SearchResultTabs = ({
  keyword,
  activeTab,
  onChange,
}: SearchResultTabsProps) => {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-bold">Results for: "{keyword}"</h2>
      <p className="text-muted-foreground text-sm">
        Showing users and posts matching your keyword.
      </p>
      <div className="mt-4 flex gap-2">
        {tabs.map((tab) => (
          <ActionButton
            key={tab.key}
            type="button"
            variant={activeTab === tab.key ? 'primary' : 'secondary'}
            className="rounded-full px-4 py-2 text-sm"
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </ActionButton>
        ))}
      </div>
    </div>
  );
};
