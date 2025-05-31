
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, X } from "lucide-react";
import { CourseWizardData } from "../CreateCourseWizard";
import { useCoaches } from "@/hooks/useCoaches";

interface CourseDetailsStepProps {
  data: CourseWizardData;
  onUpdate: (updates: Partial<CourseWizardData>) => void;
}

const categories = ["Fundamentals", "Advanced", "Competition", "Self-Defense", "Kids"];
const levels = ["Beginner", "Intermediate", "Advanced"];
const statusOptions = ["Draft", "Published"];

export const CourseDetailsStep = ({ data, onUpdate }: CourseDetailsStepProps) => {
  const { coaches } = useCoaches();
  const [newTag, setNewTag] = useState("");

  const activeCoaches = coaches.filter(coach => coach.status === "active");

  const handleAddTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      onUpdate({ tags: [...data.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: data.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-bjj-navy">Course Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title *</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor *</Label>
          <Select
            value={data.instructor}
            onValueChange={(value) => onUpdate({ instructor: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              {activeCoaches.map((coach) => (
                <SelectItem key={coach.id} value={coach.name}>
                  {coach.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Enter course description"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={data.category}
            onValueChange={(value) => onUpdate({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level *</Label>
          <Select
            value={data.level}
            onValueChange={(value) => onUpdate({ level: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={data.status}
            onValueChange={(value) => onUpdate({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Label>Course Type</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={data.priceType === "paid"}
              onCheckedChange={(checked) => 
                onUpdate({ priceType: checked ? "paid" : "free", price: checked ? data.price : 0 })
              }
            />
            <span>{data.priceType === "paid" ? "Paid" : "Free"}</span>
          </div>
        </div>

        {data.priceType === "paid" && (
          <div className="space-y-2">
            <Label htmlFor="price">Course Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={data.price}
              onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Course Tags</Label>
        <div className="flex space-x-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Add Tag
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="featuredImage">Featured Image URL</Label>
          <Input
            id="featuredImage"
            value={data.featuredImage}
            onChange={(e) => onUpdate({ featuredImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="introVideo">Intro Video (YouTube URL)</Label>
          <Input
            id="introVideo"
            value={data.introVideo}
            onChange={(e) => onUpdate({ introVideo: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      </div>
    </div>
  );
};
