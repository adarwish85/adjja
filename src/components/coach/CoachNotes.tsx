
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useCoachNotes } from "@/hooks/useCoachNotes";
import { useStudents } from "@/hooks/useStudents";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const CoachNotes = () => {
  const { notes, loading, addNote, updateNote, deleteNote } = useCoachNotes();
  const { students } = useStudents();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    student_id: "",
    note_content: "",
    session_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async () => {
    if (editingNote) {
      await updateNote(editingNote.id, formData);
      setEditingNote(null);
    } else {
      await addNote(formData);
      setIsAddingNote(false);
    }
    setFormData({
      student_id: "",
      note_content: "",
      session_date: new Date().toISOString().split('T')[0]
    });
  };

  const startEdit = (note: any) => {
    setEditingNote(note);
    setFormData({
      student_id: note.student_id,
      note_content: note.note_content,
      session_date: note.session_date
    });
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || "Unknown Student";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Coach Notes
          </CardTitle>
          <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Session Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Student</label>
                  <Select value={formData.student_id} onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {student.belt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Session Date</label>
                  <Input
                    type="date"
                    value={formData.session_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, session_date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Note</label>
                  <Textarea
                    placeholder="Session notes, progress, areas to work on..."
                    value={formData.note_content}
                    onChange={(e) => setFormData(prev => ({ ...prev, note_content: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button onClick={handleSubmit} disabled={!formData.student_id || !formData.note_content}>
                  Add Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{getStudentName(note.student_id)}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(note.session_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(note)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteNote(note.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm">{note.note_content}</p>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes yet. Start adding session notes for your students.</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Student</label>
              <Select value={formData.student_id} onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.belt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Session Date</label>
              <Input
                type="date"
                value={formData.session_date}
                onChange={(e) => setFormData(prev => ({ ...prev, session_date: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Note</label>
              <Textarea
                value={formData.note_content}
                onChange={(e) => setFormData(prev => ({ ...prev, note_content: e.target.value }))}
                rows={4}
              />
            </div>

            <Button onClick={handleSubmit}>
              Update Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
