import axios from 'axios';
import { getCurrentUser } from './authService';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function authHeaders() {
  try {
    // Check if we're in admin context first
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (adminAuth === 'admin-authenticated') {
      return { 'x-admin-auth': 'admin-authenticated' };
    }
    
    // Fallback to regular user auth
    const stored = getCurrentUser();
    const token = stored?.token || stored?.user?.token || stored?.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function fetchUsers(params = {}) {
  const { page, limit, search } = params;
  const res = await axios.get(`${BASE_URL}/api/users`, {
    headers: authHeaders(),
    params: { page, limit, search }
  });
  
  // Ensure response structure is consistent
  // The backend returns { success: true, data: users }
  return res.data; // Return raw response data for handling in the component
}

export async function createUser(payload) {
  // Using the auth signup endpoint for user creation
  const res = await axios.post(`${BASE_URL}/api/auth/signup`, payload, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  });
  return res.data; // expected: { success, user }
}

export async function updateUser(id, payload) {
  const res = await axios.put(`${BASE_URL}/api/users/${id}`, payload, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  });
  return res.data; // expected: { success, data }
}

export async function deleteUser(id) {
  const res = await axios.delete(`${BASE_URL}/api/users/${id}`, {
    headers: authHeaders()
  });
  return res.data; // expected: { success }
}

export async function toggleUserStatus(id) {
  // Since there's no specific endpoint for toggling status,
  // we'll use the update endpoint with just the status field
  const res = await axios.put(`${BASE_URL}/api/users/${id}`, 
    { status: 'toggle' }, // The backend will handle toggling logic
    { headers: { 'Content-Type': 'application/json', ...authHeaders() } }
  );
  return res.data; // expected: { success, data }
}