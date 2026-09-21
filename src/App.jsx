import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/Student/StudentDashboard";
import MiniProjectTracker from "./pages/Student/MiniProjectTracker";
import ProjectCatalogueSelection from "./pages/Student/ProjectCatalogueSelection";
import FacultyReviewPanel from "./pages/Faculty/FacultyReviewPanel";
import FacultyWeeklyReview from "./pages/Faculty/FacultyWeeklyReview";
import AcademicCatalogueManager from "./pages/AcademicOffice/AcademicCatalogueManager";
import AcademicMentorAllocation from "./pages/AcademicOffice/AcademicMentorAllocation";
import AcademicHelpdesk from "./pages/AcademicOffice/AcademicHelpdesk";
import IpFilingTracker from "./pages/IpFilingTracker";

// Protected Route Component for Role-Based Access Control
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "ACADEMIC_OFFICE") {
      return <Navigate to="/academics/catalogue" replace />;
    } else if (user.role === "IP_CELL") {
      return <Navigate to="/ip-tracker" replace />;
    } else if (user.role === "FACULTY" || user.role === "ADMIN") {
      return <Navigate to="/faculty/weekly-review" replace />;
    }
    return <Navigate to="/student/catalogue" replace />;
  }

  return children;
};

// Root Redirect Helper based on RBAC
const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === "ACADEMIC_OFFICE") {
    return <Navigate to="/academics/catalogue" replace />;
  }
  if (user.role === "IP_CELL") {
    return <Navigate to="/ip-tracker" replace />;
  }
  if (user.role === "FACULTY" || user.role === "ADMIN") {
    return <Navigate to="/faculty/weekly-review" replace />;
  }
  return <Navigate to="/student/catalogue" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Academic Office Routes (Catalogue, Allocation & Helpdesk) */}
          <Route
            path="/academics/catalogue"
            element={
              <ProtectedRoute allowedRoles={["ACADEMIC_OFFICE", "ADMIN"]}>
                <AcademicCatalogueManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academics/mentor-allocation"
            element={
              <ProtectedRoute allowedRoles={["ACADEMIC_OFFICE", "ADMIN"]}>
                <AcademicMentorAllocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academics/helpdesk"
            element={
              <ProtectedRoute allowedRoles={["ACADEMIC_OFFICE", "ADMIN"]}>
                <AcademicHelpdesk />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/catalogue"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <ProjectCatalogueSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mini-project"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <MiniProjectTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Faculty Routes */}
          <Route
            path="/faculty/weekly-review"
            element={
              <ProtectedRoute allowedRoles={["FACULTY", "ADMIN"]}>
                <FacultyWeeklyReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/dashboard"
            element={
              <ProtectedRoute allowedRoles={["FACULTY", "IP_CELL", "ADMIN"]}>
                <FacultyReviewPanel />
              </ProtectedRoute>
            }
          />

          {/* IP Filing Tracker */}
          <Route
            path="/ip-tracker"
            element={
              <ProtectedRoute allowedRoles={["STUDENT", "FACULTY", "IP_CELL", "ADMIN"]}>
                <IpFilingTracker />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}