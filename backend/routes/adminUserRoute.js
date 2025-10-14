import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import protectAdminRoutes from '../middleware/protectAdmin.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(protectAdminRoutes);

// GET /api/users → get all users
router.get('/', getUsers);

// PUT /api/users/:id → update a user by ID
router.put('/:id', updateUser);

// DELETE /api/users/:id → delete a user by ID
router.delete('/:id', deleteUser);

export default router;