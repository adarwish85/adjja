
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  isDeleting: boolean;
}

export const NoteCard = ({ note, onEdit, onDelete, isDeleting }: NoteCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-bjj-gray">
          <Calendar className="h-4 w-4" />
          {format(new Date(note.created_at), 'MMM dd, yyyy')}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-bjj-gray line-clamp-4 whitespace-pre-line">
          {note.content}
        </p>
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
