import React, { useEffect, useMemo, useState } from 'react';
import { Card, Button, FormGroup, Input, Select } from '../../components/common/FormComponents';
import { Table, SearchBar, Pagination } from '../../components/common/TableComponents';
import { FiEdit2, FiTrash2, FiMail, FiUser, FiCalendar } from 'react-icons/fi';
import { fetchUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../../services/userService';
import adminData from '../../data/adminData';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = { name: '', email: '', role: 'Job Seeker', status: 'Active' };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Load users from API
  const load = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers({ page: currentPage, limit: usersPerPage, search });
      
      if (response.success === false) throw new Error('Failed to load users');
      
      // Handle response data correctly - backend returns { success: true, data: users }
      const list = response.data || [];
      
      // Process user data to match our component's expected format
      const processedUsers = list.map(user => ({
        ...user,
        // Ensure these fields exist for the UI
        status: user.status || 'Active',
        applications: user.applications || 0,
        postedJobs: user.postedJobs || 0
      }));
      
      const t = response.total || list.length;
      
      setUsers(processedUsers);
      setTotal(t);
      
      console.log('Loaded users:', processedUsers);
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch users, showing sample data');
      // Fallback to static sample data to keep UI functional
      setUsers(adminData.users || []);
      setTotal((adminData.users || []).length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  const formatDate = (val) => {
    const d = new Date(val);
    return isNaN(d) ? (val || '—') : d.toLocaleDateString();
  };

  const columns = [
    { 
      key: 'name', 
      header: 'User',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiMail className="h-4 w-4 mr-1" />
            {row.email}
          </div>
        </div>
      )
    },
    {
      key: 'details',
      header: 'Details',
      render: (row) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <FiUser className="h-4 w-4 mr-1" />
            {row.role}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <FiCalendar className="h-4 w-4 mr-1" />
            Joined {formatDate(row.joinDate || row.createdAt)}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(row); }}
            className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === 'Suspended' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
          >
            {row.status || 'Active'}
          </button>
        </div>
      )
    },
    {
      key: 'activity',
      header: 'Activity',
      render: (row) => (
        <div className="text-sm text-gray-500">
          {row.role === 'Job Seeker' ? (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {row.applications} Applications
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
              {row.postedJobs} Jobs Posted
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => { e.stopPropagation(); openEdit(row); }}
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Filter users based on search
  // Fallback if API doesn't paginate server-side
  const filteredUsers = useMemo(() => {
    if (!users?.length) return [];
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(u => (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    ));
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil((total || filteredUsers.length) / usersPerPage));
  const currentUsers = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
  }, [filteredUsers, currentPage]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name || '', email: row.email || '', role: row.role || 'Job Seeker', status: row.status || 'Active' });
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete user ${row.name}?`)) return;
    try {
      await deleteUser(row._id); // Using _id which is MongoDB's ID field
      toast.success('User deleted');
      load();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.message || err.message || 'Delete failed');
    }
  };

  const handleToggleStatus = async (row) => {
    try {
      const res = await toggleUserStatus(row._id); // Using _id which is MongoDB's ID field
      toast.success(`User ${res.data?.status || 'status updated'}`);
      load();
    } catch (err) {
      console.error('Toggle status error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to update status');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editing) {
        await updateUser(editing._id, form); // Using _id which is MongoDB's ID field
        toast.success('User updated');
      } else {
        // For new users, we need to add password field
        const newUserData = {
          ...form,
          password: 'defaultPassword123' // You might want to generate a random password or handle this differently
        };
        await createUser(newUserData);
        toast.success('User created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error('Save error:', err);
      toast.error(err.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Manage Users</h1>

      <Card>
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <SearchBar
              value={search}
              onChange={(v) => { setCurrentPage(1); setSearch(v); }}
              placeholder="Search users..."
            />
            <Button onClick={openCreate}>
              + New User
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
            <div>Loading users...</div>
          </div>
        ) : currentUsers.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            {search ? 'No users found matching your search' : 'No users found in the system'}
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={currentUsers}
              onRowClick={(user) => openEdit(user)}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{editing ? 'Edit User' : 'Create User'}</h2>
            <form onSubmit={handleSave}>
              <FormGroup label="Full Name">
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </FormGroup>
              <FormGroup label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </FormGroup>
              <FormGroup label="Role">
                <Select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  options={[
                    { value: 'user', label: 'User' },
                    { value: 'Job Seeker', label: 'Job Seeker' },
                    { value: 'Recruiter', label: 'Recruiter' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                />
              </FormGroup>
              <FormGroup label="Status">
                <Select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Suspended', label: 'Suspended' },
                  ]}
                />
              </FormGroup>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
