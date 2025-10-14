import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component is deprecated - admins now use the regular login/signup flow
const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page where users can sign in with their admin/recruiter account
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg text-gray-600">Redirecting to login...</p>
        <p className="text-sm text-gray-500 mt-2">Admins now use the regular sign-in page</p>
      </div>
    </div>
  );
};

export default AdminLogin;
