
import { CoachLayout } from "@/components/layouts/CoachLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentCheckIn } from "@/components/coach/StudentCheckIn";
import { CoachProfileForm } from "@/components/coach/CoachProfileForm";
import { CoachNotes } from "@/components/coach/CoachNotes";
import { MyStudentsView } from "@/components/coach/MyStudentsView";
import { Users, UserCheck, BarChart3, StickyNote, User, Video, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCoachStudents } from "@/hooks/useCoachStudents";

const CoachDashboard = () => {
  const { userProfile } = useAuth();
  const { stats } = useCoachStudents();

  return (
    <CoachLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Coach Dashboard</h1>
            <p className="text-bjj-gray">Welcome back, Coach {userProfile?.name}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
                <Users className="h-4 w-4" />
                My Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{stats.totalStudents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Today's Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{stats.todayAttendance}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
                <StickyNote className="h-4 w-4" />
                Notes Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">0</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray flex items-center gap-2">
                <Video className="h-4 w-4" />
                Progress Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="checkin" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Check-In
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <MyStudentsView />
          </TabsContent>

          <TabsContent value="checkin">
            <StudentCheckIn />
          </TabsContent>

          <TabsContent value="profile">
            <CoachProfileForm />
          </TabsContent>

          <TabsContent value="notes">
            <CoachNotes />
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Progress Video Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Progress video tracker coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feed">
            <Card>
              <CardHeader>
                <CardTitle>Coach Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Coach communication feed coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Student Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Student progress analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CoachLayout>
  );
};

export default CoachDashboard;
