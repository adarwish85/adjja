
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Upload, 
  Video, 
  FileText, 
  Image, 
  Download,
  Edit,
  Trash2,
  Play,
  Eye
} from "lucide-react";

export const ContentLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const videos = [
    {
      id: 1,
      title: "Guard Retention Fundamentals",
      duration: "12:34",
      size: "145 MB",
      format: "MP4",
      uploads: new Date("2024-01-15"),
      views: 1234,
      course: "BJJ Fundamentals",
      status: "Published"
    },
    {
      id: 2,
      title: "Kimura from Closed Guard",
      duration: "8:45",
      size: "98 MB",
      format: "MP4",
      uploads: new Date("2024-02-10"),
      views: 567,
      course: "Advanced Guard System",
      status: "Published"
    },
    {
      id: 3,
      title: "Competition Mindset",
      duration: "15:22",
      size: "167 MB",
      format: "MP4",
      uploads: new Date("2024-02-28"),
      views: 89,
      course: "Competition Preparation",
      status: "Draft"
    },
  ];

  const documents = [
    {
      id: 1,
      title: "BJJ Techniques Handbook",
      type: "PDF",
      size: "2.3 MB",
      downloads: 456,
      course: "BJJ Fundamentals",
      uploaded: new Date("2024-01-20")
    },
    {
      id: 2,
      title: "Guard System Diagram",
      type: "PDF",
      size: "1.1 MB",
      downloads: 234,
      course: "Advanced Guard System",
      uploaded: new Date("2024-02-15")
    },
  ];

  const images = [
    {
      id: 1,
      title: "Position Reference - Mount",
      format: "JPG",
      size: "456 KB",
      dimensions: "1920x1080",
      course: "BJJ Fundamentals",
      uploaded: new Date("2024-01-25")
    },
    {
      id: 2,
      title: "Guard Pass Sequence",
      format: "PNG",
      size: "723 KB",
      dimensions: "1920x1080",
      course: "Advanced Guard System",
      uploaded: new Date("2024-02-20")
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bjj-gray h-4 w-4" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
        </div>
      </div>

      {/* Storage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Video className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-bjj-navy">156</p>
                <p className="text-sm text-bjj-gray">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-bjj-navy">42</p>
                <p className="text-sm text-bjj-gray">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Image className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-bjj-navy">28</p>
                <p className="text-sm text-bjj-gray">Images</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-bjj-gold rounded-full flex items-center justify-center">
                <span className="text-bjj-navy font-semibold text-sm">GB</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-bjj-navy">12.4</p>
                <p className="text-sm text-bjj-gray">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="upload">Upload Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Video Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Play className="h-12 w-12 text-bjj-gray" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-bjj-navy mb-2">{video.title}</h4>
                      <div className="space-y-1 text-sm text-bjj-gray">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{video.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{video.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span>{video.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Course:</span>
                          <span>{video.course}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge 
                          className={
                            video.status === 'Published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {video.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Document Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-bjj-navy">{doc.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-bjj-gray">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>{doc.downloads} downloads</span>
                          <span>Course: {doc.course}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Image Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Image className="h-12 w-12 text-bjj-gray" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-bjj-navy text-sm mb-2">{image.title}</h4>
                      <div className="space-y-1 text-xs text-bjj-gray">
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>{image.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{image.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dimensions:</span>
                          <span>{image.dimensions}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Upload Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
                <h3 className="text-lg font-medium text-bjj-navy mb-2">Drop files here to upload</h3>
                <p className="text-bjj-gray mb-4">or click to browse your files</p>
                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
