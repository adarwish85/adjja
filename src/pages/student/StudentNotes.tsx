
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, BookOpen, Calendar, Tag } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const StudentNotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    tags: ""
  });

  // This is a mock implementation since we don't have a notes table yet
  // In a real implementation, you'd need to create a notes table in Supabase
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['student-notes', user?.id],
    queryFn: async () => {
      // Mock data for now
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Triangle Choke Setup',
          content: 'Key points for triangle choke from guard:\n- Control the wrist\n- Create the angle\n- Pull down on the head\n- Adjust your hips',
          tags: ['guard', 'submissions', 'triangle'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Sweeps from Half Guard',
          content: 'Half guard sweep techniques:\n- Underhook sweep\n- Plan B sweep\n- Old school sweep',
          tags: ['half-guard', 'sweeps', 'bottom-game'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return mockNotes;
    },
    enabled: !!user
  });

  // Create delete mutation that properly invalidates the cache
  const deleteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      // Mock delete operation - in real app, this would be a Supabase delete
      return { success: true, deletedId: noteId };
    },
    onSuccess: () => {
      toast.success("Note deleted!");
      // Invalidate and refetch the notes query to update the UI immediately
      queryClient.invalidateQueries({ queryKey: ['student-notes'] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    }
  });

  // Create save mutation that properly invalidates the cache
  const saveMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string; tags: string; id?: string }) => {
      // Mock save operation - in real app, this would be a Supabase insert/update
      return { success: true, ...noteData };
    },
    onSuccess: () => {
      toast.success(editingNote ? "Note updated!" : "Note created!");
      setIsCreateModalOpen(false);
      resetForm();
      // Invalidate and refetch the notes query to update the UI immediately
      queryClient.invalidateQueries({ queryKey: ['student-notes'] });
    },
    onError: () => {
      toast.error("Failed to save note");
    }
  });

  // Filter notes based on search and tags
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  const resetForm = () => {
    setNoteForm({ title: "", content: "", tags: "" });
    setEditingNote(null);
  };

  const handleSubmit = async () => {
    if (!noteForm.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    saveMutation.mutate({
      title: noteForm.title,
      content: noteForm.content,
      tags: noteForm.tags,
      id: editingNote?.id
    });
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', ')
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">My Notes</h1>
            <p className="text-bjj-gray">Keep track of your BJJ learning journey</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
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
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bjj-gray h-4 w-4" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedTag === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag("")}
                >
                  All
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(note)}
                        disabled={deleteMutation.isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                        disabled={deleteMutation.isPending}
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
            ))}
          </div>
        ) : (
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
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Note
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentNotes;
