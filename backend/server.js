// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { initCloudinary } from './config/cloudinary.js';
import { initRedis, closeRedis } from './config/redis.js';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/userRoute.js';
import userRoutes from './routes/adminUserRoute.js';
import jobApplicationRoutes from './routes/jobApplicationRoutes.js';
import testEmailRoutes from './routes/testEmailRoute.js';
import seedRoutes from './routes/seedRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
dotenv.config();

// Initialize Cloudinary configuration
initCloudinary();

// Initialize Redis (optional - will work without it)
initRedis();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// auth Routes (no audit logging for auth routes)
app.use('/api/auth', authRoutes);

// job Routes
app.use('/api/jobs', jobRoutes);

// job application routes
app.use('/api/applications', jobApplicationRoutes);

// users (admin) Routes
app.use('/api/users', userRoutes);

// audit log routes
app.use('/api/audit', auditLogRoutes);

// test email routes
app.use('/api', testEmailRoutes);

// seed routes (for development/testing)
app.use('/api/seed', seedRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal';

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await closeRedis();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing connections...');
  await closeRedis();
  process.exit(0);
});

export default app;
