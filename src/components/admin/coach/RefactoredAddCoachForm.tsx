
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Coach } from "@/types/coach";
import { AddCoachBasicInfo } from "./AddCoachBasicInfo";
import { AddCoachProfessionalInfo } from "./AddCoachProfessionalInfo";
import { AddCoachAccountInfo } from "./AddCoachAccountInfo";

interface RefactoredAddCoachFormProps {
  coach?: Coach;
  onSubmit: (coach: Omit<Coach, "id" | "created_at" | "updated_at">) => void;
  isEditing?: boolean;
}

export const RefactoredAddCoachForm = ({ coach, onSubmit, isEditing = false }: RefactoredAddCoachFormProps) => {
  const [formData, setFormData] = useState({
    name: coach?.name || "",
    email: coach?.email || "",
    phone: coach?.phone || "",
    belt: coach?.belt || "",
    branch: coach?.branch || "Main Branch",
    specialties: coach?.specialties || [],
    status: coach?.status || "active" as const,
    students_count: coach?.students_count || 0,
    assigned_classes: coach?.assigned_classes || [],
    joined_date: coach?.joined_date || new Date().toISOString().split('T')[0],
    username: "",
    password: "",
    createAccount: !isEditing,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.belt) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Form submission data:", formData);

    onSubmit(formData);
    
    if (!isEditing) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        belt: "",
        branch: "Main Branch",
        specialties: [],
        status: "active",
        students_count: 0,
        assigned_classes: [],
        joined_date: new Date().toISOString().split('T')[0],
        username: "",
        password: "",
        createAccount: true,
      });
    }
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter(s => s !== specialty)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AddCoachBasicInfo 
        formData={formData} 
        setFormData={setFormData} 
      />

      <AddCoachProfessionalInfo 
        formData={formData} 
        setFormData={setFormData}
        handleSpecialtyChange={handleSpecialtyChange}
      />

      <AddCoachAccountInfo 
        formData={formData} 
        setFormData={setFormData}
        isEditing={isEditing}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
          {isEditing ? "Update Coach" : "Add Coach"}
        </Button>
      </div>
    </form>
  );
};
