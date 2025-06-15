
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentProfileFormProps {
  data: {
    name: string;
    email: string;
    phone?: string;
    belt?: string;
    branch?: string;
    birthdate?: string;
    stripes?: number;
    joined_date?: string;
  };
  onChange: (data: any) => void;
  loading: boolean;
  onSave: () => Promise<void>;
  saveState: "idle" | "saving" | "success" | "error";
  hasChanges?: boolean;
}

export function StudentProfileForm({
  data,
  onChange,
  loading,
  onSave,
  saveState,
  hasChanges = false
}: StudentProfileFormProps) {
  const [local, setLocal] = useState({ ...data });

  // Sync with parent data changes
  useEffect(() => {
    setLocal({ ...data });
  }, [data]);

  const handleChange = (field: string, value: string) => {
    const newLocal = { ...local, [field]: value };
    setLocal(newLocal);
    onChange(newLocal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={local.name}
                onChange={e => handleChange('name', e.target.value)}
                className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={local.email}
                onChange={e => handleChange('email', e.target.value)}
                className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={local.phone || ""}
                onChange={e => handleChange('phone', e.target.value)}
                className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Date of Birth</Label>
              <Input
                id="birthdate"
                type="date"
                value={local.birthdate || ""}
                onChange={e => handleChange('birthdate', e.target.value)}
                className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">Academy Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Save Button - Only show if there are changes */}
      {hasChanges && (
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-lg px-8 py-3 text-lg shadow-lg transition"
            disabled={loading || saveState === "saving"}
          >
            {saveState === "saving" ? "Saving..." : saveState === "success" ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
