
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import CoachDashboard from "@/pages/CoachDashboard";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import EditProfile from "@/pages/EditProfile";
import PublicProfile from "@/pages/PublicProfile";
import NotFound from "@/pages/NotFound";

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

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/coach"
                  element={
                    <ProtectedRoute>
                      <CoachDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-profile"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute>
                      <StudentPayments />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin/students"
                  element={
                    <ProtectedRoute>
                      <AdminStudents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/classes"
                  element={
                    <ProtectedRoute>
                      <AdminClasses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/coaches"
                  element={
                    <ProtectedRoute>
                      <AdminCoaches />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/branches"
                  element={
                    <ProtectedRoute>
                      <AdminBranches />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/attendance"
                  element={
                    <ProtectedRoute>
                      <AdminAttendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payments"
                  element={
                    <ProtectedRoute>
                      <AdminPayments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/lms"
                  element={
                    <ProtectedRoute>
                      <AdminLMS />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <AdminSettings />
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
