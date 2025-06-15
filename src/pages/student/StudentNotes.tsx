
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { NotesSearchFilter } from "@/components/notes/NotesSearchFilter";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteFormModal } from "@/components/notes/NoteFormModal";
import { EmptyNotesState } from "@/components/notes/EmptyNotesState";
import { Note } from "@/types/note";

const StudentNotes = () => {
  const { notes, isLoading, deleteMutation, saveMutation } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Filter notes based on search and tags
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  const handleSave = (noteData: { title: string; content: string; tags: string; id?: string }) => {
    saveMutation.mutate(noteData);
  };

  const handleCreateNew = () => {
    setEditingNote(null);
    setIsCreateModalOpen(true);
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
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <NotesSearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          allTags={allTags}
        />

        {/* Notes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <EmptyNotesState
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            onCreateNote={handleCreateNew}
          />
        )}

        <NoteFormModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          editingNote={editingNote}
          onSave={handleSave}
          isSaving={saveMutation.isPending}
        />
      </div>
    </StudentLayout>
  );
};

export default StudentNotes;
