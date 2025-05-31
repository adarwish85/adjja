
import { Label } from "@/components/ui/label";
import { ScheduleSelector } from "./ScheduleSelector";

interface ClassScheduleStepProps {
  schedule: string;
  onUpdate: (schedule: string) => void;
}

export const ClassScheduleStep = ({ schedule, onUpdate }: ClassScheduleStepProps) => {
  return (
    <div className="space-y-4">
      <Label>Class Schedule *</Label>
      <ScheduleSelector
        value={schedule}
        onChange={onUpdate}
      />
      <p className="text-sm text-gray-500">
        Select the days and times when this class will be held. Duration will be calculated automatically.
      </p>
    </div>
  );
};
