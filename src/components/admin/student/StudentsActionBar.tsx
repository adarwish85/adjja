
import React from "react";
import { Button } from "@/components/ui/button";

interface StudentsActionBarProps {
  selectedStudentCount: number;
  onUpgradeClick: () => void;
  onClearSelection: () => void;
}

export const StudentsActionBar: React.FC<StudentsActionBarProps> = ({
  selectedStudentCount,
  onUpgradeClick,
  onClearSelection,
}) => (
  <div className="bg-bjj-gold/10 border border-bjj-gold rounded-lg px-4 py-2 mb-2 flex items-center justify-between">
    <span className="text-bjj-navy font-medium">
      {selectedStudentCount} student{selectedStudentCount > 1 ? "s" : ""} selected
    </span>
    <div className="flex gap-2">
      <Button
        className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
        disabled={selectedStudentCount === 0}
        onClick={onUpgradeClick}
      >
        Upgrade to Coach
      </Button>
      <Button variant="outline" onClick={onClearSelection}>Clear Selection</Button>
    </div>
  </div>
);
