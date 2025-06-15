
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface BulkActionsDropdownProps {
  selected: number;
  onUpgradeClick: () => void;
  onClearSelection: () => void;
}

export const BulkActionsDropdown: React.FC<BulkActionsDropdownProps> = ({
  selected,
  onUpgradeClick,
  onClearSelection,
}) => {
  if (selected === 0) return null;
  return (
    <div className="mb-3 flex items-center">
      <span className="mr-4 text-bjj-navy font-medium">
        {selected} student{selected > 1 ? "s" : ""} selected
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <MoreHorizontal className="w-5 h-5 mr-1" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onUpgradeClick} disabled={selected === 0}>
            Upgrade to Coach
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClearSelection} disabled={selected === 0}>
            Clear Selection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
