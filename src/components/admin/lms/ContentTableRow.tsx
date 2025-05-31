
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Download, Trash2, Video, FileText, Image } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ContentLibraryItem = Tables<"content_library">;

interface ContentTableRowProps {
  item: ContentLibraryItem;
  onDelete: (id: string) => void;
}

export const ContentTableRow = ({ item, onDelete }: ContentTableRowProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "document": return FileText;
      case "image": return Image;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-red-100 text-red-800";
      case "document": return "bg-blue-100 text-blue-800";
      case "image": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const IconComponent = getTypeIcon(item.type);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <IconComponent className="h-5 w-5 text-bjj-gray" />
          <div>
            <div className="font-semibold text-bjj-navy">{item.title}</div>
            <div className="text-sm text-bjj-gray">
              Uploaded by {item.uploaded_by || "Unknown"}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getTypeColor(item.type)}>
          {item.type}
        </Badge>
      </TableCell>
      <TableCell className="text-bjj-gray">
        {formatFileSize(item.file_size || 0)}
      </TableCell>
      <TableCell className="text-bjj-gray">
        {item.type === "video" ? formatDuration(item.duration_seconds || 0) : "-"}
      </TableCell>
      <TableCell className="text-bjj-gray">
        {item.views || 0}
      </TableCell>
      <TableCell className="text-bjj-gray">
        {item.downloads || 0}
      </TableCell>
      <TableCell>
        <Badge className={item.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
          {item.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
