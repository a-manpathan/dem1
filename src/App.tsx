
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Appointments from "./pages/Appointments";
import StaffDirectory from "./pages/StaffDirectory";
import Analytics from "./pages/Analytics";
import Billing from "./pages/Billing";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorAppointments from "@/pages/doctor/DoctorAppointments";
import DoctorMessages from './pages/doctor/DoctorMessages';
import DoctorProfile from './pages/doctor/DoctorProfile';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DoctorLayout from './components/doctor/DoctorLayout';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ShiftManagement from "./pages/ShiftManagement";
import Attendance from "./pages/Attendance";
import LeaveManagement from './pages/LeaveManagement';
import DoctorPrescriptionPad from "./pages/doctor/DoctorPrescriptionPad";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredUserType }) => {
  const { isAuthenticated, userType } = useAuth();
  
  if (!isAuthenticated || userType !== requiredUserType) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, userType } = useAuth();
  
  return (
    <Routes>
      {/* Redirect root based on auth status */}
      <Route path="/" element={
        isAuthenticated ? 
          (userType === 'admin' ? <Navigate to="/appointments" replace /> : <Navigate to="/doctor/dashboard" replace />) : 
          <Navigate to="/login" replace />
      } />
      
      {/* Login route */}
      <Route path="/login" element={
        isAuthenticated ? 
          (userType === 'admin' ? <Navigate to="/appointments" replace /> : <Navigate to="/doctor/dashboard" replace />) : 
          <Login />
      } />

      <Route path="/doctor/availability" element={
        <ProtectedRoute requiredUserType="doctor">
          <DoctorLayout>
            <DoctorAvailability />
          </DoctorLayout>
        </ProtectedRoute>
      } />
      
      {/* Doctor routes */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute requiredUserType="doctor">
          <DoctorLayout>
            <DoctorDashboard />
          </DoctorLayout>
        </ProtectedRoute>
      } />
      <Route path="/doctor/appointments" element={
        <ProtectedRoute requiredUserType="doctor">
          <DoctorLayout>
            <DoctorAppointments />
          </DoctorLayout>
        </ProtectedRoute>
      } />
      <Route path="/doctor/messages" element={
        <ProtectedRoute requiredUserType="doctor">
          <DoctorLayout>
            <DoctorMessages />
          </DoctorLayout>
        </ProtectedRoute>
      } />
      <Route path="/doctor/profile" element={
        <ProtectedRoute requiredUserType="doctor">
          <DoctorLayout>
            <DoctorProfile />
          </DoctorLayout>
        </ProtectedRoute>
      } />
      <Route path="/doctor/prescription-pad" element={
        <ProtectedRoute requiredUserType="doctor">
          <DoctorLayout>
            <DoctorPrescriptionPad />
          </DoctorLayout>
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/appointments" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Appointments /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><StaffDirectory /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/shift-management" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><ShiftManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Attendance /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/leave-management" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><LeaveManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Analytics /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Billing /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/pricing" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Pricing /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Messages /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Settings /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings/hospital" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Settings /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings/notification" element={
        <ProtectedRoute requiredUserType="admin">
          <Layout><Settings /></Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
