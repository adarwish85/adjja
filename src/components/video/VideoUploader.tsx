
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  onVideoUpload: (videoUrl: string, poster?: string) => void;
  maxFileSize?: number; // in MB
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoUpload,
  maxFileSize = 100
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Video file must be smaller than ${maxFileSize}MB`,
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid video file",
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handlePosterFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    setPosterFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPosterPreview(url);
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  const removePoster = () => {
    setPosterFile(null);
    if (posterPreview) {
      URL.revokeObjectURL(posterPreview);
      setPosterPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // For now, we'll create object URLs for local preview
      // In a real application, you would upload to a storage service
      const videoUrl = URL.createObjectURL(videoFile);
      const posterUrl = posterFile ? URL.createObjectURL(posterFile) : undefined;

      onVideoUpload(videoUrl, posterUrl);

      toast({
        title: "Video uploaded successfully",
        description: "Your video is now ready to use",
      });

      // Reset form
      removeVideo();
      removePoster();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Upload Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Upload */}
        <div className="space-y-2">
          <Label htmlFor="video-upload">Video File</Label>
          <div className="flex items-center gap-4">
            {videoPreview ? (
              <div className="relative">
                <video 
                  src={videoPreview} 
                  className="w-32 h-20 object-cover border rounded-lg"
                  controls={false}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeVideo}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-1">
                MP4, WebM, or MOV. Max {maxFileSize}MB
              </p>
            </div>
          </div>
        </div>

        {/* Poster Upload */}
        <div className="space-y-2">
          <Label htmlFor="poster-upload">Poster Image (Optional)</Label>
          <div className="flex items-center gap-4">
            {posterPreview ? (
              <div className="relative">
                <img 
                  src={posterPreview} 
                  alt="Poster preview" 
                  className="w-32 h-20 object-cover border rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removePoster}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div>
              <Input
                id="poster-upload"
                type="file"
                accept="image/*"
                onChange={handlePosterFileChange}
                className="max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG, or WebP for video thumbnail
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleUpload}
          disabled={!videoFile || isUploading}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
      </CardContent>
    </Card>
  );
};
