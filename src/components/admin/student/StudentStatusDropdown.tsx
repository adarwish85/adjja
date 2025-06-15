
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";

export type StudentStatus = "active" | "inactive" | "on-hold";

interface StudentStatusDropdownProps {
  value: StudentStatus;
  onChange: (next: StudentStatus) => Promise<void> | void;
  disabled?: boolean;
}

const statusOptions: StudentStatus[] = ["active", "on-hold", "inactive"];
const statusLabels: Record<StudentStatus, string> = {
  active: "Active",
  "on-hold": "On Hold",
  inactive: "Inactive"
};

const statusBadgeClass: Record<StudentStatus, string> = {
  active: "bg-green-100 text-green-800",
  "on-hold": "bg-yellow-100 text-yellow-800",
  inactive: "bg-red-100 text-red-800"
};

export const StudentStatusDropdown: React.FC<StudentStatusDropdownProps> = ({
  value,
  onChange,
  disabled
}) => {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (newStatus: StudentStatus) => {
    if (newStatus === value) return;
    setLoading(true);
    try {
      await onChange(newStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled || loading}>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 min-w-[110px] px-2 py-1 focus:outline-none"
          aria-label="Change student status"
        >
          <Badge className={statusBadgeClass[value]}>
            {statusLabels[value]}
          </Badge>
          <ChevronDown className="h-4 w-4 ml-1" />
          {loading && <Loader2 className="animate-spin h-4 w-4 ml-1" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[99] bg-white min-w-[110px]">
        {statusOptions.map(option => (
          <DropdownMenuItem
            key={option}
            onClick={() => handleSelect(option)}
            disabled={option === value || loading}
          >
            <div className="flex items-center gap-2">
              <Badge className={statusBadgeClass[option]}>
                {statusLabels[option]}
              </Badge>
              {option === value && <span className="text-xs text-muted-foreground ml-1">(Current)</span>}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
