
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface BulkCoachActionsDropdownProps {
  selected: number;
  onSendNotificationClick: () => void;
  onAssignClassClick: () => void;
  onToggleStatusClick: () => void;
  onRemoveCoachRoleClick: () => void;
  onClearSelection: () => void;
}

export const BulkCoachActionsDropdown: React.FC<BulkCoachActionsDropdownProps> = ({
  selected,
  onSendNotificationClick,
  onAssignClassClick,
  onToggleStatusClick,
  onRemoveCoachRoleClick,
  onClearSelection,
}) => {
  if (selected === 0) return null;
  
  return (
    <div className="mb-3 flex items-center">
      <span className="mr-4 text-bjj-navy font-medium">
        {selected} coach{selected > 1 ? "es" : ""} selected
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <MoreHorizontal className="w-5 h-5 mr-1" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onSendNotificationClick} disabled={selected === 0}>
            Send Notification
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAssignClassClick} disabled={selected === 0}>
            Assign Class
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleStatusClick} disabled={selected === 0}>
            Toggle Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemoveCoachRoleClick} disabled={selected === 0}>
            Remove Coach Role
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onClearSelection} disabled={selected === 0}>
            Clear Selection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
