import User from '../models/User.js';
import { hashPassword } from '../utils/passwordUtils.js';

// Create user with hashed password
export const createUser = async (userData) => {
  try {
    const { password, ...otherData } = userData;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user with hashed password
    const user = new User({
      ...otherData,
      password: hashedPassword
    });

    await user.save();
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw new Error('Error creating user');
  }
};

// GET /api/users
export const getUsers = async (filter) => {
  try {
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });
    return users;
  } catch (err) {
    throw new Error('Server error');
  }
};

// PUT /api/users/:id
export const updateUser = async (id, data) => {
  try {
    // Handle special case for toggling status
    if (data.status === 'toggle') {
      // First get the current user to check status
      const currentUser = await User.findById(id).select('-password');
      if (!currentUser) throw new Error('User not found');

      // Toggle between 'Active' and 'Suspended'
      const newStatus = currentUser.status === 'Suspended' ? 'Active' : 'Suspended';

      const user = await User
        .findByIdAndUpdate(id, { status: newStatus }, { new: true, runValidators: true })
        .select('-password');

      return user;
    }

    // Normal update case
    const user = await User
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .select('-password');

    if (!user) throw new Error('User not found');
    return user;
  } catch (err) {
    if (err.name === 'CastError') throw new Error('Invalid user id');
    throw new Error('Server error');
  }
};

// DELETE /api/users/:id
export const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (err) {
    if (err.name === 'CastError') throw new Error('Invalid user id');
    throw new Error('Server error');
  }
};