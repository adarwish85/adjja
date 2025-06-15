
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface StudentsSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const StudentsSearchBar: React.FC<StudentsSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => (
  <div className="flex items-center space-x-2">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search students or classes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-64"
      />
    </div>
  </div>
);
