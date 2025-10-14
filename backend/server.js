// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/userRoute.js';
import userRoutes from './routes/adminUserRoute.js';
import jobApplicationRoutes from './routes/jobApplicationRoutes.js';
import testEmailRoutes from './routes/testEmailRoute.js';
import seedRoutes from './routes/seedRoutes.js';
dotenv.config();

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.v2.config({ CLOUDINARY_URL: process.env.CLOUDINARY_URL });
} else {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON body parse karne ke liye

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// auth Routes
app.use('/api/auth', authRoutes);

// job Routes
app.use('/api/jobs', jobRoutes);

// job application routes
app.use('/api/applications', jobApplicationRoutes);

// users (admin) Routes
app.use('/api/users', userRoutes);

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


export default app;
