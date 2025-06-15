import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentProgress from "./pages/StudentProgress";
import StudentLMS from "./pages/StudentLMS";
import StudentAttendance from "./pages/StudentAttendance";
import StudentNotes from "./pages/StudentNotes";
import StudentSchedule from "./pages/StudentSchedule";
import CoachDashboard from "./pages/coach/CoachDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCoaches from "./pages/admin/AdminCoaches";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminBranches from "./pages/admin/AdminBranches";
import AdminLMS from "./pages/admin/AdminLMS";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/protected" element={
              <ProtectedRoute>
                <div>Loading...</div>
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Student', 'Coach']}>
                  <Dashboard />
                </RoleGuard>
              </ProtectedRoute>
            } />
            
            <Route path="/student/profile" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Student', 'Coach']}>
                  <StudentProfile />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/student/progress" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Student', 'Coach']}>
                  <StudentProgress />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/student/lms" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Student', 'Coach']}>
                  <StudentLMS />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/student/attendance" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Student', 'Coach']}>
                  <StudentAttendance />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/student/notes" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Student', 'Coach']}>
                  <StudentNotes />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/student/schedule" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Student', 'Coach']}>
                  <StudentSchedule />
                </RoleGuard>
              </ProtectedRoute>
            } />

            {/* Coach Routes */}
            <Route path="/coach" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Coach']}>
                  <CoachDashboard />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/coach/dashboard" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Coach']}>
                  <CoachDashboard />
                </RoleGuard>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/coaches" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminCoaches />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/students" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminStudents />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/classes" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminClasses />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/branches" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminBranches />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/lms" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminLMS />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/payments" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminPayments />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/analytics" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminAnalytics />
                </RoleGuard>
              </ProtectedRoute>
            } />

            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Super Admin']}>
                  <AdminSettings />
                </RoleGuard>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
