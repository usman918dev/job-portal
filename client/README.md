# Job Portal FYP – README

## Project Title
**Job Portal – FYP Project**

## Overview
Ye project ek complete **Job Portal** hai jisme employers jobs post kar sakte hain, aur candidates unpe apply kar sakte hain. Admin dashboard se admin site manage kar sakta hai aur jobs/users ki monitoring kar sakta hai.

**Key Features:**
- User registration/login with **JWT Authentication**
- Employers can post, edit, delete jobs
- Candidates can view jobs and apply
- Admin Dashboard with static/mock data (Jobs & Users)
- Real-time form validation and search/filter functionality
- Fully responsive UI using **React + TailwindCSS**

---

## Tech Stack

**Frontend:**
- React (Vite)
- TailwindCSS
- React Router DOM
- React Icons
- Axios (optional, for future API integration)

**Backend:**
- Node.js & Express.js
- MongoDB (Atlas/Local)
- JWT Authentication
- Mongoose

---

## Project Structure (High Level)

```bash
/client        # Frontend (React + TailwindCSS)
  /src
    /components
    /pages
    /context
    App.jsx
    main.jsx
/server        # Backend (Node.js + Express)
  /models
  /routes
  /controllers
  server.js
  config.js
