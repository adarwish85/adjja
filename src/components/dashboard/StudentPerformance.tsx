
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award } from "lucide-react";

const studentNotes = [
  { student: "Alex Johnson", note: "Needs work on guard passing", priority: "medium" },
  { student: "Sarah Chen", note: "Excellent progress on submissions", priority: "positive" },
  { student: "Mike Rodriguez", note: "Ready for blue belt test", priority: "high" },
  { student: "Emma Davis", note: "Improving takedown defense", priority: "medium" },
];

const promotionReadiness = [
  { student: "Carlos Silva", belt: "Blue Belt", readiness: "Ready" },
  { student: "Lisa Wang", belt: "1st Stripe", readiness: "Ready" },
  { student: "Tom Anderson", belt: "2nd Stripe", readiness: "Almost" },
];

export const StudentPerformance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Student Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-bjj-navy mb-3">Recent Notes</h3>
          <div className="space-y-2">
            {studentNotes.map((note, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{note.student}</div>
                  <div className="text-xs text-bjj-gray">{note.note}</div>
                </div>
                <Badge 
                  variant={note.priority === 'high' ? 'destructive' : 
                           note.priority === 'positive' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {note.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-bjj-navy mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Promotion Readiness
          </h3>
          <div className="space-y-2">
            {promotionReadiness.map((promo, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-bjj-gold/10 rounded">
                <div>
                  <div className="font-medium text-sm">{promo.student}</div>
                  <div className="text-xs text-bjj-gray">{promo.belt}</div>
                </div>
                <Badge 
                  variant={promo.readiness === 'Ready' ? 'default' : 'secondary'}
                  className="text-xs bg-bjj-gold text-white"
                >
                  {promo.readiness}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
