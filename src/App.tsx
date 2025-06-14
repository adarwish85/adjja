
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";

// Import pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import CoachDashboard from "@/pages/CoachDashboard";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import EditProfile from "@/pages/EditProfile";
import PublicProfile from "@/pages/PublicProfile";
import NotFound from "@/pages/NotFound";
import AccessDenied from "@/pages/AccessDenied";

// Import admin pages
import AdminStudents from "@/pages/admin/AdminStudents";
import AdminClasses from "@/pages/admin/AdminClasses";
import AdminCoaches from "@/pages/admin/AdminCoaches";
import AdminBranches from "@/pages/admin/AdminBranches";
import AdminAttendance from "@/pages/admin/AdminAttendance";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminLMS from "@/pages/admin/AdminLMS";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminSettings from "@/pages/admin/AdminSettings";
import StudentPayments from "@/pages/StudentPayments";
import PaymentSuccess from "@/pages/PaymentSuccess";
import CourseLanding from "@/pages/CourseLanding";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SettingsProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/athlete/:slug" element={<PublicProfile />} />
                <Route path="/course/:courseId" element={<CourseLanding />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/access-denied" element={<AccessDenied />} />

                {/* Student routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Student']}>
                        <StudentDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Student']}>
                        <StudentPayments />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Coach routes */}
                <Route
                  path="/coach"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Coach']}>
                        <CoachDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <SuperAdminDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <SuperAdminDashboard />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/students"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminStudents />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/classes"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminClasses />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/coaches"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminCoaches />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/branches"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminBranches />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/attendance"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminAttendance />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payments"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminPayments />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/lms"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminLMS />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminAnalytics />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['Super Admin', 'Admin']}>
                        <AdminSettings />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                {/* Shared protected routes */}
                <Route
                  path="/edit-profile"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
