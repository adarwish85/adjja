
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
import { X, Copy, Play } from "lucide-react";
import { CourseWizardData } from "../CreateCourseWizard";
import { useCoaches } from "@/hooks/useCoaches";
import { useToast } from "@/hooks/use-toast";
import { isValidYouTubeUrl } from "@/utils/youtubeUtils";

interface CourseDetailsStepProps {
  data: CourseWizardData;
  onUpdate: (updates: Partial<CourseWizardData>) => void;
  courseId?: string;
  onPreviewVideo: (videoUrl: string) => void;
}

const categories = ["Fundamentals", "Advanced", "Competition", "Self-Defense", "Kids"];
const levels = ["Beginner", "Intermediate", "Advanced"];
const statusOptions = ["Draft", "Published"];

export const CourseDetailsStep = ({ data, onUpdate, courseId, onPreviewVideo }: CourseDetailsStepProps) => {
  const { coaches } = useCoaches();
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link Copied!",
      description: "Course link has been copied to clipboard.",
    });
  };

  const handlePreviewVideo = () => {
    if (data.introVideo && isValidYouTubeUrl(data.introVideo)) {
      onPreviewVideo(data.introVideo);
    } else {
      toast({
        title: "Invalid Video URL",
        description: "Please enter a valid YouTube URL to preview.",
        variant: "destructive",
      });
    }
  };

  const courseLink = courseId ? `${window.location.origin}/course/${courseId}` : null;

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
          {courseLink && (
            <div className="mt-2">
              <Label className="text-sm text-gray-600">Course Link:</Label>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border mt-1">
                <code className="text-xs flex-1 text-left text-gray-700">{courseLink}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(courseLink)}
                  className="h-6 w-6 p-0"
                  title="Copy course link"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
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
          <p className="text-xs text-gray-500">
            Leave empty to use the first video thumbnail as featured image
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="introVideo">Intro Video (YouTube URL)</Label>
          <div className="flex space-x-2">
            <Input
              id="introVideo"
              value={data.introVideo}
              onChange={(e) => onUpdate({ introVideo: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1"
            />
            {data.introVideo && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreviewVideo}
                className="flex items-center gap-1"
              >
                <Play className="h-3 w-3" />
                Preview
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Leave empty to use the first lesson video as intro
          </p>
        </div>
      </div>
    </div>
  );
};
