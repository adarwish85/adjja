
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BJJDetailsStepProps {
  data: {
    belt: string;
    stripes: number;
    years_practicing: number;
    previous_team: string;
  };
  updateData: (data: Partial<any>) => void;
}

const beltColors = [
  { value: "White", label: "White Belt", color: "#FFFFFF" },
  { value: "Blue", label: "Blue Belt", color: "#0066CC" },
  { value: "Purple", label: "Purple Belt", color: "#6600CC" },
  { value: "Brown", label: "Brown Belt", color: "#8B4513" },
  { value: "Black", label: "Black Belt", color: "#000000" },
  { value: "Coral", label: "Coral Belt", color: "#FF6B35" },
  { value: "Red", label: "Red Belt", color: "#CC0000" },
];

export const BJJDetailsStep = ({ data, updateData }: BJJDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Tell us about your Brazilian Jiu-Jitsu background. All fields are required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="belt">Current Belt *</Label>
          <Select value={data.belt} onValueChange={(value) => updateData({ belt: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select your current belt" />
            </SelectTrigger>
            <SelectContent>
              {beltColors.map((belt) => (
                <SelectItem key={belt.value} value={belt.value}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: belt.color }}
                    />
                    {belt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="stripes">Stripes *</Label>
          <Select 
            value={data.stripes.toString()} 
            onValueChange={(value) => updateData({ stripes: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stripes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 Stripes</SelectItem>
              <SelectItem value="1">1 Stripe</SelectItem>
              <SelectItem value="2">2 Stripes</SelectItem>
              <SelectItem value="3">3 Stripes</SelectItem>
              <SelectItem value="4">4 Stripes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="years_practicing">Years Practicing BJJ *</Label>
        <Input
          id="years_practicing"
          type="number"
          min="0"
          step="0.5"
          value={data.years_practicing || ''}
          onChange={(e) => updateData({ years_practicing: parseFloat(e.target.value) || 0 })}
          placeholder="How many years have you been practicing?"
          required
        />
      </div>

      <div>
        <Label htmlFor="previous_team">Previous Team/Academy *</Label>
        <Input
          id="previous_team"
          value={data.previous_team}
          onChange={(e) => updateData({ previous_team: e.target.value })}
          placeholder="Enter your previous team or academy name"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          If this is your first academy, you can write "First Academy" or "None"
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your belt and stripe information will be verified by our instructors. 
          Please ensure accuracy to maintain the integrity of our grading system.
        </p>
      </div>
    </div>
  );
};
