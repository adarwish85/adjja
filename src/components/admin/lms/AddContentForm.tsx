
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContentLibrary } from "@/hooks/useContentLibrary";
import { useCourses } from "@/hooks/useCourses";
import { Upload } from "lucide-react";

interface AddContentFormProps {
  onClose: () => void;
}

export const AddContentForm = ({ onClose }: AddContentFormProps) => {
  const { createContentItem } = useContentLibrary();
  const { courses } = useCourses();
  
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    file_url: "",
    file_size: "",
    duration_seconds: "",
    course_id: "",
    uploaded_by: "Admin",
    status: "Published",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contentData = {
      ...formData,
      file_size: parseInt(formData.file_size) || null,
      duration_seconds: parseInt(formData.duration_seconds) || null,
      course_id: formData.course_id || null,
    };

    createContentItem.mutate(contentData);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Content Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter content title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Content Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_id">Associated Course (Optional)</Label>
          <Select
            value={formData.course_id}
            onValueChange={(value) => handleChange("course_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Course</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file_url">File URL</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="file_url"
            value={formData.file_url}
            onChange={(e) => handleChange("file_url", e.target.value)}
            placeholder="Enter file URL or upload file"
            required
          />
          <Button type="button" variant="outline" size="sm">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Note: File upload functionality requires backend storage setup
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="file_size">File Size (bytes)</Label>
          <Input
            id="file_size"
            type="number"
            min="0"
            value={formData.file_size}
            onChange={(e) => handleChange("file_size", e.target.value)}
            placeholder="File size in bytes"
          />
        </div>

        {formData.type === "video" && (
          <div className="space-y-2">
            <Label htmlFor="duration_seconds">Duration (seconds)</Label>
            <Input
              id="duration_seconds"
              type="number"
              min="0"
              value={formData.duration_seconds}
              onChange={(e) => handleChange("duration_seconds", e.target.value)}
              placeholder="Duration in seconds"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
          Upload Content
        </Button>
      </div>
    </form>
  );
};
