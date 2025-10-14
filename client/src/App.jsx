import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";
import AuthModal from "./components/AuthModal";
import LandingPage from "./pages/LandingPage";
import { AppContext } from "./context/AppContext";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminManageJobs from "./pages/admin/ManageJobs";
import AdminManageUsers from "./pages/admin/ManageUsers";
import AdminProfile from "./pages/admin/AdminProfile";
import SeedData from "./pages/admin/SeedData";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAuthToken } from "./services/api";

const App = () => {
  const { showAuthModal, setShowAuthModal, setCurrentUser, currentUser } = useContext(AppContext);
  const [authMode, setAuthMode] = React.useState("Sign Up");
  const navigate = useNavigate();

  // Initialize auth token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Simple authentication check
  const isAuthenticated = () => {
    return currentUser !== null && currentUser !== undefined && currentUser.email;
  };

  const handleLogin = (userData) => {
    console.log('handleLogin called with userData:', userData);
    
    // Add null checks before setting user data
    if (userData) {
      console.log('User logged in:', userData);
      
      // Ensure we have at least basic user structure
      const userToSet = { 
        ...userData,
        role: userData.role || 'user', // Default role if missing
        name: userData.name || userData.email?.split('@')[0] || 'User',
        email: userData.email || '',
        companyName: userData.companyName
      };
      
      console.log('Setting currentUser to:', userToSet);
      setCurrentUser(userToSet);
      
      // Close auth modal and redirect based on role
      setShowAuthModal(false);
      
      const adminRoles = ['admin', 'Admin', 'Recruiter'];
      if (adminRoles.includes(userToSet.role)) {
        console.log('Admin user logged in, redirecting to admin dashboard');
        // Remove old session storage approach
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminUser');
        // Redirect to admin dashboard
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      console.error('handleLogin called with undefined userData');
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setAuthMode("Sign Up"); // Reset to default
  };

  // Auto-open auth modal removed to prevent showing on every refresh

  // If user is not authenticated, show the landing page
  if (!isAuthenticated()) {
    return (
      <div>
        <Routes>
          {/* Email verification route accessible to unauthenticated users */}
          <Route path="/verify-email" element={<EmailVerification />} />
          {/* Password reset route accessible to unauthenticated users */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={
            <LandingPage 
              onLogin={handleLogin}
              authMode={authMode}
              setAuthMode={setAuthMode}
              showAuthModal={showAuthModal}
              setShowAuthModal={setShowAuthModal}
              handleAuthModalClose={handleAuthModalClose}
            />
          } />
        </Routes>
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={3}
        />
      </div>
    );
  }

  // Authenticated users can access all routes
  return (
    <div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose}
        onLogin={handleLogin}
        initialMode={authMode}
        canClose={true} // Allow closing when already authenticated
      />
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/apply-job/:id" element={<div style={{padding:'2rem'}}>Job detail page is being rebuilt. Please check back soon.</div>} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminManageJobs />} />
          <Route path="seed" element={<SeedData />} />
          <Route path="users" element={<AdminManageUsers />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
