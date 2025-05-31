
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/integrations/supabase/types";

type Branch = Tables<"branches">;

interface EditBranchFormProps {
  branch: Branch;
  onSave: (branchData: Partial<Branch>) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const EditBranchForm = ({ branch, onSave, onClose, isLoading }: EditBranchFormProps) => {
  const [formData, setFormData] = useState({
    name: branch.name,
    address: branch.address,
    city: branch.city,
    phone: branch.phone,
    description: branch.description || "",
    capacity: branch.capacity.toString(),
    status: branch.status || "Active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Edit branch form submitted:", formData);
    onSave({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      description: formData.description || null,
      capacity: parseInt(formData.capacity),
      status: formData.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Branch Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Downtown Academy"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-phone">Phone Number *</Label>
          <Input
            id="edit-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="edit-address">Street Address *</Label>
          <Input
            id="edit-address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="123 Main Street"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-city">City *</Label>
          <Input
            id="edit-city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Los Angeles"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-capacity">Student Capacity *</Label>
          <Input
            id="edit-capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
            placeholder="200"
            min="1"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the branch location and facilities..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
          disabled={!formData.name || !formData.address || !formData.city || !formData.phone || !formData.capacity || isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
