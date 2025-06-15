
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StudentAcademyInfoProps {
  local: any;
}

export function StudentAcademyInfo({ local }: StudentAcademyInfoProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="belt">Belt Rank</Label>
        <Input
          id="belt"
          value={local.belt || ""}
          className="bg-gray-100 border-gray-300 cursor-not-allowed"
          readOnly
          disabled
        />
        <p className="text-xs text-gray-500">Managed by academy staff</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="stripes">Stripes</Label>
        <Input
          id="stripes"
          value={local.stripes || 0}
          className="bg-gray-100 border-gray-300 cursor-not-allowed"
          readOnly
          disabled
        />
        <p className="text-xs text-gray-500">Managed by academy staff</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Input
          id="branch"
          value={local.branch || ""}
          className="bg-gray-100 border-gray-300 cursor-not-allowed"
          readOnly
          disabled
        />
        <p className="text-xs text-gray-500">Contact admin to change</p>
      </div>
    </div>
  );
}
