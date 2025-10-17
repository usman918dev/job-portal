# 🎯 Job Portal - Complete Setup Guide

A full-stack job portal application built with React, Node.js, Express, MongoDB, and Redis caching.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)

---

## ✨ Features

### User Features
- ✅ Job search and filtering with skill matching
- ✅ Apply for jobs with resume upload
- ✅ View application status
- ✅ User profile management with skills
- ✅ Email notifications

### Admin Features
- ✅ Post and manage job listings
- ✅ Add skills to job postings
- ✅ View applications for posted jobs
- ✅ User and application management
- ✅ Audit logs for tracking actions

### Performance Features
- ✅ Redis caching for faster job listings
- ✅ Optimized database queries
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Pagination support

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.x
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (HTTP Client)
- **React Router** (Navigation)

### Backend
- **Node.js** (Runtime)
- **Express** 5.x (Framework)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **Redis** (Caching - Optional)
- **JWT** (Authentication)
- **Bcrypt** (Password hashing)
- **Cloudinary** (File uploads)
- **Nodemailer** (Email service)

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** (Local or [Atlas Cloud](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

Optional:
- **Redis** for caching ([Download](https://redis.io/) or use cloud service)
- **Cloudinary** account for file uploads
- **Gmail** account for email service

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/usman918dev/job-portal.git
cd job-portal
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# See Configuration section below
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../client

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend Configuration (.env)

Create a `.env` file in the `backend` directory with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
ADMIN_EMAIL=admin@example.com

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@jobportal.com

# Frontend
FRONTEND_URL=http://localhost:5173

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (Optional - for caching)
# REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:5000` for API calls. If needed, check `client/src/services/api.js`.

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🏃 Running the Application

### Option 1: Development Mode (Recommended)

#### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

Expected output:
```
✅ MongoDB connected
✅ Redis connected successfully (if configured)
Server running on port 5000
```

#### Terminal 2 - Frontend Server

```bash
cd client
npm run dev
```

Expected output:
```
Local:   http://localhost:5173
```

#### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Option 2: Production Build

#### Build Frontend

```bash
cd client
npm run build
```

This creates an optimized `dist` folder.

#### Run Backend with Production Frontend

```bash
cd backend
npm start
```

---

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   │   ├── redis.js          # Redis configuration
│   │   └── cloudinary.js      # Cloudinary configuration
│   ├── controllers/           # Route handlers
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/
│   │   └── cacheUtils.js      # Caching utilities
│   ├── seeders/               # Database seeders
│   ├── server.js              # Main server file
│   ├── .env.example           # Environment variables template
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── context/           # React context
│   │   ├── utils/             # Utility functions
│   │   ├── constants/         # Constants
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static files
│   ├── vite.config.js         # Vite configuration
│   └── package.json
│
├── REDIS_IMPLEMENTATION.md    # Redis setup guide
├── ENV_SETUP_GUIDE.md         # Detailed env setup
└── README.md                  # This file
```

---

## 📡 API Documentation

### Authentication

#### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "role": "user"
}
```

#### Sign In
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}
```

### Jobs

#### Get All Jobs (with pagination and search)
```bash
GET /api/jobs?page=1&limit=10&search=developer
```

#### Get Single Job
```bash
GET /api/jobs/:id
```

#### Create Job (Admin only)
```bash
POST /api/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "location": "Karachi",
  "jobType": "full-time",
  "salaryRange": "100000 - 200000",
  "description": "...",
  "skills": ["React", "Node.js", "MongoDB"]
}
```

#### Apply for Job
```bash
POST /api/applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobId": "...",
  "resume": "file_url"
}
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Problem**: `MongooseError: Cannot connect to database`

**Solution**:
1. Check if MongoDB is running
2. Verify `MONGO_URI` in `.env`
3. For MongoDB Atlas, ensure IP whitelist includes your IP
4. Check network connection

### Redis Connection Error

**Problem**: `Redis connection failed`

**Solution**:
1. Redis is optional - the app works without it
2. If you want to use Redis:
   - Ensure Redis is running: `redis-cli ping`
   - Verify `REDIS_URL` in `.env`
   - Check firewall settings

### Email Not Sending

**Problem**: `Email service error`

**Solution**:
1. For Gmail: Use app-specific password, not regular password
2. Enable "Less secure app access" if using old Gmail
3. Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`
4. Check email configuration in backend logs

### Cloudinary Upload Error

**Problem**: `Cloudinary configuration error`

**Solution**:
1. Verify Cloudinary credentials in `.env`
2. Check if credentials have upload permissions
3. File uploads work without Cloudinary (falls back to local)
4. Verify file size is under 5MB

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::5000`

**Solution**:
```bash
# Find and kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### CORS Error

**Problem**: `Access to XMLHttpRequest blocked by CORS`

**Solution**:
1. Ensure `FRONTEND_URL` is correct in backend `.env`
2. Check `ALLOWED_ORIGINS` includes your frontend URL
3. Restart backend server after changing `.env`

---

## ⚡ Performance Optimization

### Redis Caching

Redis improves performance by caching job listings:

**With Redis**:
- Response time: ~5-20ms
- Database load: Reduced 70-80%

**Without Redis**:
- Response time: ~100-500ms
- Database load: Higher

**Enable Redis**:
1. Install Redis
2. Add `REDIS_URL` to `.env`
3. Restart backend

### Database Indexing

MongoDB automatically indexes `_id`. Additional indexes:
```javascript
// In MongoDB Atlas or local MongoDB
db.newjobs.createIndex({ title: "text", company: "text", location: "text" })
```

### Frontend Optimization

- Pagination: 9 jobs per page
- Lazy loading: Images load on demand
- Code splitting: Routes loaded dynamically
- Caching: API responses cached in browser

---

## 🌐 Deployment

### Deploy Backend

#### Heroku

```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGO_URI=your-mongo-uri
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### DigitalOcean / AWS / Azure

1. Push code to Git repository
2. Set environment variables in dashboard
3. Configure build and deployment commands
4. Deploy using their CI/CD pipeline

### Deploy Frontend

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd client
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

```bash
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
MONGO_URI=mongodb+srv://...production...
JWT_SECRET=generate-strong-secret
EMAIL_USER=your-production-email@gmail.com
CLOUDINARY_CLOUD_NAME=...
REDIS_URL=rediss://...production-redis...
```

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redis Documentation](https://redis.io/documentation)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_widget)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Need Help?

1. **Check the docs**: Review `ENV_SETUP_GUIDE.md` and `REDIS_IMPLEMENTATION.md`
2. **Check troubleshooting**: See Troubleshooting section above
3. **Check console logs**: They often contain helpful error messages
4. **Test connections**:
   ```bash
   # Test MongoDB
   mongodb+srv://username:password@...
   
   # Test Redis
   redis-cli ping
   
   # Test API
   curl http://localhost:5000/api/jobs
   ```

---

## 🎉 You're All Set!

Your Job Portal is now ready to use. Happy coding! 🚀

**Quick Start Commands**:
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd client && npm run dev

# Open browser
http://localhost:5173
```

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
