
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Users, 
  Award, 
  Clock, 
  PlayCircle,
  BookOpen,
  TrendingUp,
  Filter
} from "lucide-react";

export const StudentProgress = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const studentProgress = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      enrolledCourses: 3,
      completedCourses: 1,
      totalWatchTime: "45h 30m",
      lastActive: "2 hours ago",
      currentCourse: "Advanced Guard System",
      progress: 65,
      certificates: 2,
      status: "Active"
    },
    {
      id: 2,
      name: "Maria Silva",
      email: "maria@example.com",
      enrolledCourses: 5,
      completedCourses: 3,
      totalWatchTime: "78h 15m",
      lastActive: "1 day ago",
      currentCourse: "Competition Preparation",
      progress: 40,
      certificates: 4,
      status: "Active"
    },
    {
      id: 3,
      name: "Roberto Santos",
      email: "roberto@example.com",
      enrolledCourses: 2,
      completedCourses: 2,
      totalWatchTime: "32h 45m",
      lastActive: "3 days ago",
      currentCourse: "BJJ Fundamentals",
      progress: 100,
      certificates: 3,
      status: "Completed"
    },
  ];

  const courseProgress = [
    {
      course: "BJJ Fundamentals",
      totalStudents: 234,
      completed: 156,
      inProgress: 67,
      notStarted: 11,
      avgCompletion: 78,
      avgRating: 4.9
    },
    {
      course: "Advanced Guard System",
      totalStudents: 89,
      completed: 34,
      inProgress: 45,
      notStarted: 10,
      avgCompletion: 62,
      avgRating: 4.8
    },
    {
      course: "Competition Preparation",
      totalStudents: 156,
      completed: 89,
      inProgress: 56,
      notStarted: 11,
      avgCompletion: 71,
      avgRating: 4.7
    },
  ];

  const topPerformers = [
    { name: "Maria Silva", coursesCompleted: 8, watchTime: "120h", certificates: 9 },
    { name: "Carlos Rodriguez", coursesCompleted: 6, watchTime: "95h", certificates: 7 },
    { name: "Ana Oliveira", coursesCompleted: 5, watchTime: "87h", certificates: 6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bjj-gray h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
          Export Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-bjj-navy">1,247</p>
                <p className="text-sm text-bjj-gray">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-bjj-navy">3,456</p>
                <p className="text-sm text-bjj-gray">Course Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-bjj-navy">789</p>
                <p className="text-sm text-bjj-gray">Certificates Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-bjj-gold-dark" />
              <div>
                <p className="text-2xl font-bold text-bjj-navy">12,450</p>
                <p className="text-sm text-bjj-gray">Hours Watched</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Course Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courseProgress.map((course, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-bjj-navy">{course.course}</h4>
                    <span className="text-sm text-bjj-gray">{course.avgCompletion}% avg completion</span>
                  </div>
                  <Progress value={course.avgCompletion} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-sm text-bjj-gray">
                    <div className="flex items-center space-x-4">
                      <span>✅ {course.completed} completed</span>
                      <span>⏳ {course.inProgress} in progress</span>
                      <span>⭕ {course.notStarted} not started</span>
                    </div>
                    <span>⭐ {course.avgRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-bjj-gold rounded-full flex items-center justify-center text-bjj-navy font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-bjj-navy">{student.name}</p>
                      <div className="flex items-center space-x-3 text-sm text-bjj-gray">
                        <span>{student.coursesCompleted} courses</span>
                        <span>{student.watchTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-bjj-gold" />
                      <span className="font-semibold text-bjj-navy">{student.certificates}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Individual Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Current Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Watch Time</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentProgress.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-bjj-navy">{student.name}</div>
                      <div className="text-sm text-bjj-gray">{student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{student.enrolledCourses} enrolled</div>
                      <div className="text-bjj-gray">{student.completedCourses} completed</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-bjj-navy">{student.currentCourse}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={student.progress} className="h-2" />
                      <span className="text-sm text-bjj-gray">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-bjj-gray" />
                      <span className="text-sm">{student.totalWatchTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-bjj-gold" />
                      <span className="font-medium">{student.certificates}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-bjj-gray">
                    {student.lastActive}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        student.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : student.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
