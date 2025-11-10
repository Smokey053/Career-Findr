import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "./theme/theme";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ImpersonationProvider } from "./contexts/ImpersonationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import ImpersonationBanner from "./components/common/ImpersonationBanner";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import CourseSearch from "./pages/student/CourseSearch";
import CourseDetails from "./pages/student/CourseDetails";
import MyApplications from "./pages/student/MyApplications";
import ApplicationForm from "./pages/student/ApplicationForm";
import JobBoard from "./pages/student/JobBoard";
import JobDetails from "./pages/student/JobDetails";
import JobApplicationForm from "./pages/student/JobApplicationForm";

// Institute Pages
import InstituteDashboard from "./pages/institute/InstituteDashboard";
import CourseManagement from "./pages/institute/CourseManagement";
import CourseForm from "./pages/institute/CourseForm";
import ApplicationReview from "./pages/institute/ApplicationReview";

// Company Pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import JobManagement from "./pages/company/JobManagement";
import JobForm from "./pages/company/JobForm";
import ApplicantReview from "./pages/company/ApplicantReview";
import CandidateSearch from "./pages/company/CandidateSearch";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import PlatformStats from "./pages/admin/PlatformStats";

// Common Pages (All Roles)
import SavedItems from "./pages/common/SavedItems";
import Messages from "./pages/common/Messages";
import Notifications from "./pages/common/Notifications";
import CalendarPage from "./pages/common/CalendarPage";
import Profile from "./pages/common/Profile";
import Settings from "./pages/common/Settings";

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ width: "100%", minHeight: "100vh", overflow: "hidden" }}>
          <BrowserRouter>
            <AuthProvider>
              <NotificationProvider>
                <ImpersonationProvider>
                  <ImpersonationBanner />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />

                    {/* Student Routes */}
                    <Route
                      path="/dashboard/student"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <Navbar />
                          <StudentDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/courses"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <Navbar />
                          <CourseSearch />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/courses/:courseId"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <Navbar />
                          <CourseDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/applications"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <Navbar />
                          <MyApplications />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/apply/:courseId"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <Navbar />
                          <ApplicationForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/jobs"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <Navbar />
                          <JobBoard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/jobs/:jobId"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <Navbar />
                          <JobDetails />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/jobs/:jobId/apply"
                      element={
                        <ProtectedRoute allowedRoles={["student"]}>
                          <Navbar />
                          <JobApplicationForm />
                        </ProtectedRoute>
                      }
                    />

                    {/* Institute Routes */}
                    <Route
                      path="/dashboard/institute"
                      element={
                        <ProtectedRoute allowedRoles={["institute"]}>
                          <Navbar />
                          <InstituteDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/institute/courses"
                      element={
                        <ProtectedRoute allowedRoles={["institute"]}>
                          <Navbar />
                          <CourseManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/institute/courses/new"
                      element={
                        <ProtectedRoute allowedRoles={["institute"]}>
                          <Navbar />
                          <CourseForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/institute/courses/edit/:courseId"
                      element={
                        <ProtectedRoute allowedRoles={["institute"]}>
                          <Navbar />
                          <CourseForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/institute/applications"
                      element={
                        <ProtectedRoute allowedRoles={["institute"]}>
                          <Navbar />
                          <ApplicationReview />
                        </ProtectedRoute>
                      }
                    />

                    {/* Company Routes */}
                    <Route
                      path="/dashboard/company"
                      element={
                        <ProtectedRoute allowedRoles={["company"]}>
                          <Navbar />
                          <CompanyDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/company/jobs"
                      element={
                        <ProtectedRoute allowedRoles={["company"]}>
                          <Navbar />
                          <JobManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/company/jobs/new"
                      element={
                        <ProtectedRoute allowedRoles={["company"]}>
                          <Navbar />
                          <JobForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/company/jobs/edit/:jobId"
                      element={
                        <ProtectedRoute allowedRoles={["company"]}>
                          <Navbar />
                          <JobForm />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/company/jobs/:jobId/applicants"
                      element={
                        <ProtectedRoute allowedRoles={["company"]}>
                          <Navbar />
                          <ApplicantReview />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/company/candidates"
                      element={
                        <ProtectedRoute allowedRoles={["company"]}>
                          <Navbar />
                          <CandidateSearch />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/dashboard/admin"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <Navbar />
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <Navbar />
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/stats"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <Navbar />
                          <PlatformStats />
                        </ProtectedRoute>
                      }
                    />

                    {/* Common Routes (All Authenticated Users) */}
                    <Route
                      path="/saved"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "student",
                            "institute",
                            "company",
                            "admin",
                          ]}
                        >
                          <Navbar />
                          <SavedItems />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/messages"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "student",
                            "institute",
                            "company",
                            "admin",
                          ]}
                        >
                          <Navbar />
                          <Messages />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "student",
                            "institute",
                            "company",
                            "admin",
                          ]}
                        >
                          <Navbar />
                          <Notifications />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/calendar"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "student",
                            "institute",
                            "company",
                            "admin",
                          ]}
                        >
                          <Navbar />
                          <CalendarPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Profile and Settings Routes */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "student",
                            "institute",
                            "company",
                            "admin",
                          ]}
                        >
                          <Navbar />
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute
                          allowedRoles={[
                            "student",
                            "institute",
                            "company",
                            "admin",
                          ]}
                        >
                          <Navbar />
                          <Settings />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ImpersonationProvider>
              </NotificationProvider>
            </AuthProvider>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
