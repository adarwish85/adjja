
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

interface EmptyNotesStateProps {
  searchQuery: string;
  selectedTag: string;
  onCreateNote: () => void;
}

export const EmptyNotesState = ({ searchQuery, selectedTag, onCreateNote }: EmptyNotesStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <BookOpen className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
        <h3 className="text-lg font-medium text-bjj-navy mb-2">
          {searchQuery || selectedTag ? 'No matching notes' : 'No notes yet'}
        </h3>
        <p className="text-bjj-gray mb-4">
          {searchQuery || selectedTag 
            ? 'Try adjusting your search or filter criteria'
            : 'Start documenting your BJJ journey by creating your first note'
          }
        </p>
        {!searchQuery && !selectedTag && (
          <Button onClick={onCreateNote}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Note
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
