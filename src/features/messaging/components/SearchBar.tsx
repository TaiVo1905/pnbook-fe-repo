import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="border-b p-4">
      <div className="relative">
        <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
        <input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full bg-[#f0f2f5] py-2 pr-4 pl-10 outline-none"
          placeholder="Search conversations..."
        />
      </div>
    </div>
  );
};
