
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SpeechToTextProvider } from './components/doctor/SpeechToTextProvider';
import { initializeSpeechToText, updateTranscriptTextarea } from './utils/speechToTextConnector';
import { useEffect, useState, lazy, Suspense } from 'react';

// Lazy load components
const Layout = lazy(() => import("./components/Layout"));
const DoctorLayout = lazy(() => import('./components/doctor/DoctorLayout'));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SpeechToTextInitializer = lazy(() => import('./components/doctor/SpeechToTextInitializer'));

// Admin pages
const Appointments = lazy(() => import("./pages/Appointments"));
const StaffDirectory = lazy(() => import("./pages/StaffDirectory"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Billing = lazy(() => import("./pages/Billing"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Settings = lazy(() => import("./pages/Settings"));
const Messages = lazy(() => import("./pages/Messages"));
const ShiftManagement = lazy(() => import("./pages/ShiftManagement"));
const Attendance = lazy(() => import("./pages/Attendance"));
const LeaveManagement = lazy(() => import('./pages/LeaveManagement'));

// Doctor pages
const DoctorDashboard = lazy(() => import("@/pages/doctor/DoctorDashboard"));
const DoctorAppointments = lazy(() => import("@/pages/doctor/DoctorAppointments"));
const DoctorMessages = lazy(() => import('./pages/doctor/DoctorMessages'));
const DoctorProfile = lazy(() => import('./pages/doctor/DoctorProfile'));
const DoctorAvailability = lazy(() => import('./pages/doctor/DoctorAvailability'));
const DoctorPrescriptionPad = lazy(() => import("./pages/doctor/DoctorPrescriptionPad"));

// Patient pages
const PatientHome = lazy(() => import('./pages/patient/PatientHome'));
const PatientAppointments = lazy(() => import('./pages/patient/PatientAppointments'));
const PatientLayout = lazy(() => import('./components/patient/PatientLayout'));

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
          (userType === 'admin' ? <Navigate to="/appointments" replace /> : 
           userType === 'doctor' ? <Navigate to="/doctor/dashboard" replace /> : 
           <Navigate to="/patient/home" replace />) : 
          <Navigate to="/login" replace />
      } />
      
      {/* Login route */}
      <Route path="/login" element={
        isAuthenticated ? 
          (userType === 'admin' ? <Navigate to="/appointments" replace /> : 
           userType === 'doctor' ? <Navigate to="/doctor/dashboard" replace /> : 
           <Navigate to="/patient/home" replace />) : 
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Login />
          </Suspense>
      } />

      <Route path="/doctor/availability" element={
        <ProtectedRoute requiredUserType="doctor">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <DoctorLayout>
              <DoctorAvailability />
            </DoctorLayout>
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Doctor routes */}
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute requiredUserType="doctor">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <DoctorLayout>
              <DoctorDashboard />
            </DoctorLayout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/doctor/appointments" element={
        <ProtectedRoute requiredUserType="doctor">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <DoctorLayout>
              <DoctorAppointments />
            </DoctorLayout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/doctor/messages" element={
        <ProtectedRoute requiredUserType="doctor">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <DoctorLayout>
              <DoctorMessages />
            </DoctorLayout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/doctor/profile" element={
        <ProtectedRoute requiredUserType="doctor">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <DoctorLayout>
              <DoctorProfile />
            </DoctorLayout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/doctor/prescription-pad" element={
        <ProtectedRoute requiredUserType="doctor">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <DoctorLayout>
              <DoctorPrescriptionPad />
            </DoctorLayout>
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/appointments" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Appointments /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><StaffDirectory /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/shift-management" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><ShiftManagement /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Attendance /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/leave-management" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><LeaveManagement /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Analytics /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Billing /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/pricing" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Pricing /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Messages /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Settings /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/settings/hospital" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Settings /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/settings/notification" element={
        <ProtectedRoute requiredUserType="admin">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Layout><Settings /></Layout>
          </Suspense>
        </ProtectedRoute>
      } />
      {/* Patient routes */}
      <Route path="/patient/home" element={
        <ProtectedRoute requiredUserType="patient">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <PatientLayout>
              <PatientHome />
            </PatientLayout>
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/patient/appointments" element={
        <ProtectedRoute requiredUserType="patient">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <PatientLayout>
              <PatientAppointments />
            </PatientLayout>
          </Suspense>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  );
};

const App = () => {
  const [isSTTInitialized, setIsSTTInitialized] = useState(false);

  useEffect(() => {
    if (!isSTTInitialized) {
      initializeSpeechToText();
      setIsSTTInitialized(true);
    }
  }, [isSTTInitialized]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <SpeechToTextProvider 
                language="en-US" 
                onTranscriptChange={updateTranscriptTextarea}
              >
                <AppRoutes />
                <Suspense fallback={null}>
                  <SpeechToTextInitializer 
                    isRecording={false} 
                    onTranscriptChange={() => {}} 
                    onToggleRecording={() => {}}
                  />
                </Suspense>
              </SpeechToTextProvider>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
