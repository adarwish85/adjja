
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Video, FileText } from "lucide-react";

export const LMSUpload = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Upload className="h-5 w-5" />
          LMS Quick Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-bjj-gray mx-auto mb-2" />
          <p className="text-sm text-bjj-gray mb-2">Drag & drop files here</p>
          <Button variant="outline" size="sm">
            Browse Files
          </Button>
        </div>
        
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            <Video className="h-4 w-4 mr-2" />
            Upload Technique Video
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            <FileText className="h-4 w-4 mr-2" />
            Upload Course Material
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
