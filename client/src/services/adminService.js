import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Helper to get admin headers
const getAdminHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Users API
export const fetchUsers = async ({ page = 1, limit = 10, search = '' }) => {
  try {
    const headers = getAdminHeaders();
    const response = await axios.get(`${backendUrl}/api/users`, { 
      headers,
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const headers = getAdminHeaders();
    const response = await axios.put(`${backendUrl}/api/users/${id}`, userData, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const headers = getAdminHeaders();
    const response = await axios.delete(`${backendUrl}/api/users/${id}`, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleUserStatus = async (id) => {
  try {
    const headers = getAdminHeaders();
    const response = await axios.put(`${backendUrl}/api/users/${id}/toggle-status`, {}, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};