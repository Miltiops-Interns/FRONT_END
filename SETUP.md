# 🛠️ Local Development Setup Guide

Quick guide to run the Hotel Website locally on your PC.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd FRONT_END
```

### 2. Setup Backend

```bash
cd backend

# Copy environment example
cp env.example .env

# Edit .env with your MongoDB Atlas credentials
# Update these values:
# - MONGO_URI
# - JWT_SECRET
# - EMAIL_* settings

# Install dependencies
npm install

# Start backend server
npm start
# Backend runs on http://localhost:5000
```

### 3. Setup Frontend (New Terminal)

```bash
# From project root
cd ..

# Copy environment example
cp env.example .env

# .env should contain:
# REACT_APP_API_URL=http://localhost:5000

# Install dependencies
npm install

# Start frontend
npm start
# Frontend runs on http://localhost:3000
```

### 4. Create Admin User

Using curl:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Or using Postman/Insomnia:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

## 🔑 MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com/
2. Create free cluster (M0)
3. Create database user
4. Allow access from anywhere (0.0.0.0/0)
5. Get connection string
6. Format: `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/restaurant-app?retryWrites=true&w=majority&appName=Cluster0`
7. Put in backend/.env as MONGO_URI

## 📧 Gmail Setup for Emails

1. Enable 2-Step Verification in your Google Account
2. Go to: Google Account → Security → 2-Step Verification → App passwords
3. Generate app password
4. Use this in backend/.env as EMAIL_PASS

## ✅ Test Everything

- Frontend: http://localhost:3000
- Backend Health: http://localhost:5000/health
- Admin Login: http://localhost:3000/admin/login

## 🎯 Default Admin Credentials

After registration:
- Username: admin
- Password: (whatever you set)

## 📁 Project Structure

```
FRONT_END/
├── backend/           # Backend API
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── utils/        # Email service
│   └── server.js     # Entry point
├── src/              # Frontend React app
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── context/      # State management
│   ├── utils/        # Utilities
│   └── config/       # API configuration
└── public/           # Static assets
```

## 🔧 Common Issues

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### MongoDB Connection Error

- Check internet connection
- Verify MongoDB Atlas credentials
- Ensure IP whitelist includes 0.0.0.0/0
- Check if cluster is paused

### CORS Errors

- Ensure backend is running
- Check FRONTEND_URL in backend/.env
- Verify REACT_APP_API_URL in frontend .env

## 📚 Next Steps

1. Add menu items via admin dashboard
2. Test reservations and orders
3. Customize styling and content
4. Deploy to production (see DEPLOYMENT.md)

## 🚀 Deployment

For production deployment on Render, see [DEPLOYMENT.md](./DEPLOYMENT.md)

