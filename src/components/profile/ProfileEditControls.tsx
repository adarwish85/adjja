
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileEditControlsProps {
  isEditing: boolean;
  hasChanges: boolean;
  saveAllState: "idle" | "saving" | "success" | "error";
  onEditToggle: () => void;
  onSaveAll: () => void;
}

export const ProfileEditControls = ({
  isEditing,
  hasChanges,
  saveAllState,
  onEditToggle,
  onSaveAll
}: ProfileEditControlsProps) => {
  if (!isEditing) {
    return (
      <Button
        onClick={onEditToggle}
        className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-xl px-6 py-3 flex items-center gap-2"
      >
        <Edit className="h-5 w-5" />
        Edit Profile
      </Button>
    );
  }

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={onEditToggle}
        className="font-semibold rounded-xl px-6 py-3 flex items-center gap-2"
      >
        <X className="h-5 w-5" />
        Cancel
      </Button>
      {hasChanges && (
        <Button
          onClick={onSaveAll}
          className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-xl px-6 py-3 flex items-center gap-2"
          disabled={saveAllState === "saving"}
        >
          <Save className="h-5 w-5" />
          {saveAllState === "saving" ? "Saving..." : saveAllState === "success" ? "Saved!" : "Save All Changes"}
        </Button>
      )}
    </div>
  );
};
