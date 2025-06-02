
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface SpecialtiesManagementProps {
  specialties: string[];
  onUpdate: (specialties: string[]) => void;
}

export const SpecialtiesManagement = ({ specialties, onUpdate }: SpecialtiesManagementProps) => {
  const [newSpecialty, setNewSpecialty] = useState("");

  const addSpecialty = () => {
    if (!newSpecialty.trim()) {
      toast.error("Please enter a specialty name");
      return;
    }

    if (specialties.includes(newSpecialty.trim())) {
      toast.error("Specialty already exists");
      return;
    }

    const updatedSpecialties = [...specialties, newSpecialty.trim()];
    onUpdate(updatedSpecialties);
    setNewSpecialty("");
    toast.success("Specialty added successfully");
  };

  const removeSpecialty = (specialtyToRemove: string) => {
    const updatedSpecialties = specialties.filter(s => s !== specialtyToRemove);
    onUpdate(updatedSpecialties);
    toast.success("Specialty removed successfully");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSpecialty();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy">Coach Specialties Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter new specialty"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={addSpecialty} className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Current Specialties:</h4>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                {specialty}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-red-100"
                  onClick={() => removeSpecialty(specialty)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          {specialties.length === 0 && (
            <p className="text-gray-500">No specialties configured yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
