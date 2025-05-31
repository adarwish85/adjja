
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ContentFiltersProps {
  searchTerm: string;
  selectedType: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export const ContentFilters = ({
  searchTerm,
  selectedType,
  onSearchChange,
  onTypeChange,
}: ContentFiltersProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-bjj-gray" />
        <Input
          placeholder="Search content..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="all">All Types</option>
        <option value="video">Videos</option>
        <option value="document">Documents</option>
        <option value="image">Images</option>
      </select>
    </div>
  );
};
