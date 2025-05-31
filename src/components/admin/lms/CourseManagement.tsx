
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  PlayCircle,
  Clock,
  Star
} from "lucide-react";

export const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      id: 1,
      title: "BJJ Fundamentals",
      instructor: "Master Silva",
      category: "Beginner",
      students: 234,
      videos: 25,
      duration: "8 hours",
      rating: 4.9,
      status: "Published",
      price: "$49.99",
      created: "2024-01-15"
    },
    {
      id: 2,
      title: "Advanced Guard System",
      instructor: "Coach Roberto",
      category: "Advanced",
      students: 89,
      videos: 18,
      duration: "6 hours",
      rating: 4.8,
      status: "Published",
      price: "$79.99",
      created: "2024-02-10"
    },
    {
      id: 3,
      title: "Competition Preparation",
      instructor: "Coach Ana",
      category: "Intermediate",
      students: 156,
      videos: 22,
      duration: "7 hours",
      rating: 4.7,
      status: "Draft",
      price: "$59.99",
      created: "2024-02-28"
    },
  ];

  const draftCourses = [
    {
      id: 4,
      title: "Kimura System Deep Dive",
      instructor: "Master Silva",
      progress: 65,
      videos: "8/12",
      lastUpdated: "2 days ago"
    },
    {
      id: 5,
      title: "Takedown Fundamentals",
      instructor: "Coach Maria",
      progress: 30,
      videos: "3/10",
      lastUpdated: "1 week ago"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bjj-gray h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
        <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      <Tabs defaultValue="published" className="space-y-6">
        <TabsList>
          <TabsTrigger value="published">Published Courses</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="analytics">Course Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Published Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-bjj-navy">{course.title}</div>
                          <div className="text-sm text-bjj-gray">Created {course.created}</div>
                        </div>
                      </TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-bjj-gray" />
                          <span>{course.students}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center space-x-1">
                            <PlayCircle className="h-4 w-4 text-bjj-gray" />
                            <span>{course.videos} videos</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="h-4 w-4 text-bjj-gray" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{course.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{course.price}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            course.status === 'Published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Draft Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {draftCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-bjj-navy">{course.title}</h4>
                      <p className="text-sm text-bjj-gray">by {course.instructor}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-bjj-gray">Progress: {course.progress}%</span>
                        <span className="text-sm text-bjj-gray">Videos: {course.videos}</span>
                        <span className="text-sm text-bjj-gray">Last updated: {course.lastUpdated}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-bjj-gold h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        Continue Editing
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy">Top Performing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-bjj-gold rounded-full flex items-center justify-center text-bjj-navy font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-bjj-navy">{course.title}</p>
                          <p className="text-sm text-bjj-gray">{course.students} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-bjj-navy">{course.price}</p>
                        <p className="text-sm text-bjj-gray">⭐ {course.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy">Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-bjj-navy">Beginner</span>
                    <span className="font-semibold">$12,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-bjj-navy">Intermediate</span>
                    <span className="font-semibold">$8,920</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-bjj-navy">Advanced</span>
                    <span className="font-semibold">$15,680</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
