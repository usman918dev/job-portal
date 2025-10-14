import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { getCurrentUser } from '../services/authService';

const AuthDebug = () => {
  const { currentUser } = useContext(AppContext);

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const storageData = getCurrentUser();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2">Auth Debug Panel</h3>
      
      <div className="text-xs space-y-2">
        <div>
          <strong>Context User:</strong>
          <pre className="bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-32">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>LocalStorage:</strong>
          <pre className="bg-gray-900 p-2 rounded mt-1 overflow-auto max-h-32">
            {JSON.stringify(storageData, null, 2)}
          </pre>
        </div>
        
        <button 
          onClick={handleClearStorage}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
        >
          Clear Storage & Reload
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;