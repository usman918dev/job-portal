import {
  getUsers as getUsersService,
  updateUser as updateUserService,
  deleteUser as deleteUserService
} from '../services/userService.js';

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const users = await getUsersService(filter);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    const status = err.message === 'Invalid user id' ? 400 : err.message === 'User not found' ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    const status = err.message === 'Invalid user id' ? 400 : err.message === 'User not found' ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};