
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const CoachNotes = () => {
  return (
    <CoachLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-bjj-navy">My Notes</h1>
          <p className="text-bjj-gray">Personal notes and observations</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <FileText className="h-5 w-5 text-bjj-gold" />
              Personal Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-bjj-gray">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs">Your personal notes will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CoachLayout>
  );
};

export default CoachNotes;
