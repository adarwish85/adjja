import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentLMS from "./pages/student/StudentLMS";
import StudentProgress from "./pages/student/StudentProgress";
import StudentNotes from "./pages/student/StudentNotes";
import StudentSchedule from "./pages/student/StudentSchedule";
import StudentProfile from "./pages/student/StudentProfile";
import CoachDashboard from "./pages/CoachDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminCoaches from "./pages/admin/AdminCoaches";
import AdminBranches from "./pages/admin/AdminBranches";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminLMS from "./pages/admin/AdminLMS";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminSettings from "./pages/admin/AdminSettings";
import EditProfile from "./pages/EditProfile";
import PublicProfile from "./pages/PublicProfile";
import CourseLanding from "./pages/CourseLanding";
import PaymentSuccess from "./pages/PaymentSuccess";
import StudentPayments from "./pages/StudentPayments";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <SettingsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="/profile/:profileSlug" element={<PublicProfile />} />
                <Route path="/course/:courseId" element={<CourseLanding />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                
                <Route path="/protected" element={
                  <ProtectedRoute>
                    <div>Protected content</div>
                  </ProtectedRoute>
                } />
                
                {/* Student Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['Student']}>
                      <StudentDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/student/*" element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['Student']}>
                      <Routes>
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="attendance" element={<StudentAttendance />} />
                        <Route path="lms" element={<StudentLMS />} />
                        <Route path="progress" element={<StudentProgress />} />
                        <Route path="notes" element={<StudentNotes />} />
                        <Route path="schedule" element={<StudentSchedule />} />
                        <Route path="profile" element={<StudentProfile />} />
                      </Routes>
                    </RoleGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/coach" element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['Coach']}>
                      <CoachDashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes - keep existing code the same */}
                <Route path="/admin/*" element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                      <Routes>
                        <Route index element={<SuperAdminDashboard />} />
                        <Route path="students" element={<AdminStudents />} />
                        <Route path="classes" element={<AdminClasses />} />
                        <Route path="coaches" element={<AdminCoaches />} />
                        <Route path="branches" element={<AdminBranches />} />
                        <Route path="payments" element={<AdminPayments />} />
                        <Route path="lms" element={<AdminLMS />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="attendance" element={<AdminAttendance />} />
                        <Route path="settings" element={<AdminSettings />} />
                      </Routes>
                    </RoleGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/edit-profile" element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } />
                
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={['Student']}>
                      <StudentPayments />
                    </RoleGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SettingsProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
