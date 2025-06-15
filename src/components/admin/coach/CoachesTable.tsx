
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Mail, Phone, GraduationCap } from "lucide-react";
import { Coach } from "@/types/coach";

interface CoachesTableProps {
  coaches: Coach[];
  selectedCoachIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectCoach: (coachId: string, checked: boolean) => void;
  onEditCoach: (coach: Coach) => void;
  onDeleteCoach: (coach: Coach) => void;
  getBeltColor: (belt: string) => string;
}

export const CoachesTable: React.FC<CoachesTableProps> = ({
  coaches,
  selectedCoachIds,
  onSelectAll,
  onSelectCoach,
  onEditCoach,
  onDeleteCoach,
  getBeltColor,
}) => {
  const allSelected = coaches.length > 0 && selectedCoachIds.length === coaches.length;
  const someSelected = selectedCoachIds.length > 0 && selectedCoachIds.length < coaches.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all coaches"
            />
          </TableHead>
          <TableHead>Coach</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Belt</TableHead>
          <TableHead>Specialties</TableHead>
          <TableHead>Assigned Classes</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coaches.map((coach) => (
          <TableRow 
            key={coach.id}
            className={selectedCoachIds.includes(coach.id) ? "bg-muted/50" : ""}
          >
            <TableCell>
              <Checkbox
                checked={selectedCoachIds.includes(coach.id)}
                onCheckedChange={(checked) => onSelectCoach(coach.id, checked as boolean)}
                aria-label={`Select ${coach.name}`}
              />
            </TableCell>
            <TableCell>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-bjj-navy">{coach.name}</span>
                  {coach.is_upgraded_student && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Upgraded
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-bjj-gray">
                  Joined {new Date(coach.joined_date).toLocaleDateString()}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <Mail className="h-3 w-3 mr-1 text-bjj-gray" />
                  {coach.email}
                </div>
                {coach.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-3 w-3 mr-1 text-bjj-gray" />
                    {coach.phone}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getBeltColor(coach.belt)}>
                {coach.belt}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {coach.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {coach.specialties.length === 0 && (
                  <span className="text-gray-500 text-sm">None</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {coach.assigned_classes?.map((className) => (
                  <Badge key={className} variant="outline" className="text-xs">
                    {className}
                  </Badge>
                )) || <span className="text-gray-500 text-sm">None</span>}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{coach.students_count}</div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={coach.status === "active" ? "default" : "secondary"}
                className={coach.status === "active" ? "bg-green-100 text-green-800" : ""}
              >
                {coach.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditCoach(coach)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteCoach(coach)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
