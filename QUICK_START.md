# ⚡ Quick Start Guide

Get your Hotel Website running in 5 minutes!

## 🚀 Super Quick Setup

### Option 1: Automated Setup (Windows)

1. **Run the setup script**:
   ```cmd
   scripts\setup.bat
   ```

2. **Start development servers**:
   ```cmd
   scripts\start-dev.bat
   ```

3. **Create admin user**:
   ```cmd
   scripts\create-admin.bat
   ```

4. **Test your API**:
   ```cmd
   scripts\test-api.bat
   ```

### Option 2: Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

2. **Configure environment**:
   - Edit `backend/.env` with your MongoDB Atlas credentials
   - Edit `.env` with your backend URL

3. **Start servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   npm start
   ```

4. **Create admin user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

## 🌐 Access Your Website

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

## 🔧 Environment Setup

### Backend (.env)
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/restaurant-app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-secret-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@example.com
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📋 What to Do Next

1. **Add menu items** via admin dashboard
2. **Test all features**:
   - Browse menu
   - Add items to cart
   - Make reservation
   - Submit contact form
3. **Deploy to production** (see DEPLOYMENT.md)

## 🆘 Need Help?

- **Local Setup**: See SETUP.md
- **Deployment**: See DEPLOYMENT.md
- **Environment Variables**: See ENVIRONMENT_VARIABLES.md
- **Troubleshooting**: Check the troubleshooting sections in the docs

## 🎯 Quick Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can login to admin panel
- [ ] Menu page displays items
- [ ] Cart functionality works
- [ ] Contact form submits
- [ ] Reservation form works

---

**Ready to go live? Check out DEPLOYMENT.md for production deployment! 🚀**
