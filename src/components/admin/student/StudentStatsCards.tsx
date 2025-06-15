
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import { Student } from "@/hooks/useStudents";
import { useClassEnrollments } from "@/hooks/useClassEnrollments";

interface StudentStatsCardsProps {
  students: Student[];
  enrollments: ReturnType<typeof useClassEnrollments>["enrollments"];
}

export const StudentStatsCards: React.FC<StudentStatsCardsProps> = ({ students, enrollments }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-bjj-gray">Total Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-bjj-navy">{students.length}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-bjj-gray">Active Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-bjj-navy">
          {students.filter(s => s.status === "active").length}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-bjj-gray">Avg Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-bjj-navy">
          {students.length > 0 ? Math.round(students.reduce((sum, student) => sum + student.attendance_rate, 0) / students.length) : 0}%
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-bjj-gray">Total Enrollments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-bjj-navy">
          {enrollments.filter(e => e.status === "active").length}
        </div>
      </CardContent>
    </Card>
  </div>
);
