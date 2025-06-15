
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Note } from "@/types/note";

interface NoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNote: Note | null;
  onSave: (noteData: { title: string; content: string; tags: string; id?: string }) => void;
  isSaving: boolean;
}

export const NoteFormModal = ({
  open,
  onOpenChange,
  editingNote,
  onSave,
  isSaving
}: NoteFormModalProps) => {
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    tags: ""
  });

  useEffect(() => {
    if (editingNote) {
      setNoteForm({
        title: editingNote.title,
        content: editingNote.content,
        tags: editingNote.tags.join(', ')
      });
    } else {
      setNoteForm({ title: "", content: "", tags: "" });
    }
  }, [editingNote]);

  const handleSubmit = async () => {
    if (!noteForm.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    onSave({
      title: noteForm.title,
      content: noteForm.content,
      tags: noteForm.tags,
      id: editingNote?.id
    });

    if (!editingNote) {
      toast.success("Note created!");
    } else {
      toast.success("Note updated!");
    }
    
    onOpenChange(false);
    setNoteForm({ title: "", content: "", tags: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          <DialogDescription>
            Add your BJJ notes, techniques, and observations
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              placeholder="e.g., Triangle Choke Setup"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              placeholder="Write your notes here..."
              rows={8}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input
              value={noteForm.tags}
              onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
              placeholder="e.g., guard, submissions, triangle"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
