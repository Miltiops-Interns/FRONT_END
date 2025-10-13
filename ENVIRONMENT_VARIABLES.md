# 🔐 Environment Variables Reference

Complete list of environment variables needed for the Hotel Website application.

## 🔧 Backend Environment Variables

Location: `backend/.env`

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/restaurant-app?retryWrites=true&w=majority` | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-key-min-32-chars` | ✅ Yes |
| `PORT` | Server port number | `5000` | ⚠️ Auto-set by Render |
| `NODE_ENV` | Environment mode | `production` or `development` | ✅ Yes |
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` | ✅ For emails |
| `EMAIL_PORT` | SMTP server port | `587` | ✅ For emails |
| `EMAIL_USER` | Email account username | `your-email@gmail.com` | ✅ For emails |
| `EMAIL_PASS` | Email account password/app password | `your-app-password` | ✅ For emails |
| `ADMIN_EMAIL` | Email to receive notifications | `admin@example.com` | ✅ For emails |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `https://your-frontend.onrender.com` | ✅ For production |

### Example Backend .env

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://hoteluser:SecurePass123@cluster0.coynk5o.mongodb.net/restaurant-app?retryWrites=true&w=majority&appName=Cluster0

# Security
JWT_SECRET=ThisIsAVerySecureRandomStringForJWTSigning123456

# Server
PORT=5000
NODE_ENV=production

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=hotelrestaurant@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
ADMIN_EMAIL=admin@hotelwebsite.com

# CORS
FRONTEND_URL=https://hotel-frontend.onrender.com
```

## 🎨 Frontend Environment Variables

Location: `.env` (project root)

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API base URL | `https://hotel-backend.onrender.com` | ✅ Yes |

### Example Frontend .env

**For Local Development:**
```env
REACT_APP_API_URL=http://localhost:5000
```

**For Production (Render):**
```env
REACT_APP_API_URL=https://hotel-backend.onrender.com
```

## 🔑 How to Generate Secure Values

### JWT_SECRET

Generate a strong random secret:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Manual
# Use a password generator to create a 32+ character string
```

### EMAIL_PASS (Gmail App Password)

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Click **Select app** → Choose **Mail**
5. Click **Select device** → Choose **Other** (Custom name)
6. Name it "Hotel Website Backend"
7. Click **Generate**
8. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
9. Use this in your .env file (with or without spaces)

## 🌍 Environment-Specific Configurations

### Local Development

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=dev-secret-key-change-in-production
PORT=5000
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
```

### Production (Render)

**Backend Environment Variables (Set in Render Dashboard):**
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=<strong-random-string>
PORT=5000
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com
FRONTEND_URL=https://your-frontend.onrender.com
```

**Frontend Environment Variables (Set in Render Dashboard):**
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

## 🔒 Security Best Practices

1. **Never commit .env files** to Git (already in .gitignore)
2. **Use strong, unique secrets** for JWT_SECRET
3. **Use Gmail App Passwords** instead of your main password
4. **Rotate secrets periodically** for production
5. **Use different values** for development and production
6. **Keep MongoDB credentials secure** and use strong passwords
7. **Restrict MongoDB IP access** in production (optional but recommended)

## 📝 Setting Environment Variables on Render

### For Web Service (Backend)

1. Go to your Web Service on Render
2. Click **"Environment"** in the left sidebar
3. Click **"Add Environment Variable"**
4. Enter **Key** and **Value**
5. Click **"Save Changes"** (this triggers a redeploy)

### For Static Site (Frontend)

1. Go to your Static Site on Render
2. Click **"Environment"** in the left sidebar
3. Add environment variables
4. **Important**: Variable names must start with `REACT_APP_`
5. Click **"Save"** (this triggers a rebuild)

## ✅ Verification Checklist

Before deploying, ensure you have:

- [ ] MongoDB Atlas cluster created and accessible
- [ ] Database user created with read/write permissions
- [ ] MongoDB connection string tested and working
- [ ] JWT_SECRET generated (32+ characters)
- [ ] Gmail App Password created (if using email features)
- [ ] All backend environment variables set
- [ ] Frontend REACT_APP_API_URL pointing to correct backend
- [ ] CORS frontend URL configured in backend
- [ ] No .env files committed to Git

## 🐛 Common Issues

### Backend can't connect to MongoDB

- Check MONGO_URI format
- Verify username and password (no special characters without encoding)
- Ensure Network Access allows your IP or 0.0.0.0/0
- Check if database name is included in connection string

### Email notifications not working

- Verify EMAIL_USER and EMAIL_PASS are correct
- Ensure 2-Step Verification is enabled in Gmail
- Check if App Password is valid (16 characters)
- Try regenerating App Password

### Frontend can't reach backend

- Check REACT_APP_API_URL is correct (no trailing slash)
- Verify backend FRONTEND_URL matches your frontend domain
- Check if backend is running and healthy (/health endpoint)
- Look for CORS errors in browser console

### JWT errors

- Ensure JWT_SECRET is the same across all backend instances
- Check if JWT_SECRET is at least 32 characters
- Verify secret has no trailing spaces or newlines

## 🔄 Updating Environment Variables

### Development

1. Edit `.env` file
2. Restart your server

### Production (Render)

1. Go to service settings
2. Edit environment variable
3. Click "Save" - Render auto-redeploys
4. Wait 5-10 minutes for deployment

---

**Security Note**: Never share your .env file or post environment variables publicly!

