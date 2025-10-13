# 🚀 Deployment Guide for Hotel Website on Render

This guide will help you deploy your Hotel Website (Frontend + Backend) on Render with MongoDB Atlas.

## 📋 Prerequisites

1. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. A [Render](https://render.com/) account
3. Your code pushed to a GitHub repository

---

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create a MongoDB Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Build a Database"** or **"Create"**
3. Choose **FREE** tier (M0 Sandbox)
4. Select your preferred cloud provider and region
5. Name your cluster (default: Cluster0)
6. Click **"Create Cluster"**

### 1.2 Create Database User

1. Go to **Database Access** (left sidebar under Security)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username and password (save these!)
5. Set **"Database User Privileges"** to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access

1. Go to **Network Access** (left sidebar under Security)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

> ⚠️ **Note**: For production, you should restrict this to specific IPs for better security.

### 1.4 Get Connection String

1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database password
7. Add your database name after `.mongodb.net/`: `/restaurant-app`

**Final connection string should look like:**
```
mongodb+srv://myuser:mypassword@cluster0.coynk5o.mongodb.net/restaurant-app?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🔧 Step 2: Deploy Backend on Render

### 2.1 Create Backend Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `hotel-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 2.2 Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `MONGO_URI` | Your MongoDB Atlas connection string | Database connection |
| `JWT_SECRET` | Generate a random string (e.g., `openssl rand -base64 32`) | JWT signing key |
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `production` | Environment |
| `EMAIL_HOST` | `smtp.gmail.com` | Email server |
| `EMAIL_PORT` | `587` | Email port |
| `EMAIL_USER` | Your Gmail address | Sender email |
| `EMAIL_PASS` | Gmail app password | Email password |
| `ADMIN_EMAIL` | Your admin email | Notification recipient |
| `FRONTEND_URL` | (Add after frontend deployment) | CORS allowed origin |

> 📧 **Gmail Setup**: To use Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833):
> 1. Go to your Google Account
> 2. Security → 2-Step Verification → App passwords
> 3. Generate a new app password
> 4. Use this password for `EMAIL_PASS`

### 2.3 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Copy your backend URL (e.g., `https://hotel-backend.onrender.com`)
4. Test the health endpoint: `https://hotel-backend.onrender.com/health`

---

## 🎨 Step 3: Deploy Frontend on Render

### 3.1 Create Frontend Static Site

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the site:
   - **Name**: `hotel-frontend` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### 3.2 Add Frontend Environment Variable

In **Environment** section, add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | Your backend URL (e.g., `https://hotel-backend.onrender.com`) |

### 3.3 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (5-10 minutes)
3. Copy your frontend URL (e.g., `https://hotel-frontend.onrender.com`)

---

## 🔄 Step 4: Update Backend CORS

After frontend deployment, you need to update the backend's `FRONTEND_URL`:

1. Go to your **Backend Web Service** on Render
2. Click **"Environment"** in the left sidebar
3. Edit the `FRONTEND_URL` variable
4. Set it to your frontend URL: `https://hotel-frontend.onrender.com`
5. Save changes (this will redeploy the backend)

---

## 👤 Step 5: Create Admin User

Since your admin dashboard requires authentication, you need to create an admin user:

### Option 1: Using API Tool (Postman/Insomnia)

Send a POST request to register an admin:

```
POST https://hotel-backend.onrender.com/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "your_secure_password"
}
```

### Option 2: Using Terminal (curl)

```bash
curl -X POST https://hotel-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_secure_password"}'
```

### Option 3: Temporary Registration Route

You can temporarily enable a registration route in your backend, create the admin user, then remove/protect it.

---

## ✅ Step 6: Test Your Deployment

### Test Backend Endpoints

1. **Health Check**: 
   ```
   https://hotel-backend.onrender.com/health
   ```

2. **Menu Items**: 
   ```
   https://hotel-backend.onrender.com/api/menu
   ```

### Test Frontend

1. Visit your frontend URL: `https://hotel-frontend.onrender.com`
2. Test the following features:
   - Homepage loads correctly
   - Menu page displays items
   - Contact form submission
   - Reservation form
   - Cart functionality
   - Admin login at `/admin/login`

---

## 🎯 Step 7: Custom Domain (Optional)

### For Frontend

1. Go to your Static Site on Render
2. Click **"Settings"** → **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Follow instructions to configure DNS

### For Backend

1. Go to your Web Service on Render
2. Click **"Settings"** → **"Custom Domain"**
3. Add your API subdomain (e.g., `api.yourdomain.com`)
4. Update `REACT_APP_API_URL` in frontend environment variables
5. Update `FRONTEND_URL` in backend environment variables

---

## 🔒 Security Best Practices

1. **Strong JWT Secret**: Use a long random string
2. **Secure Email Password**: Use Gmail App Password, not your main password
3. **Environment Variables**: Never commit `.env` files to Git
4. **MongoDB**: Consider restricting IP access in production
5. **HTTPS**: Render provides free SSL certificates
6. **Rate Limiting**: Consider adding rate limiting to your API

---

## 🐛 Troubleshooting

### Backend Won't Start

- Check logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct
- Test MongoDB connection from MongoDB Atlas UI

### Frontend Shows Connection Errors

- Verify `REACT_APP_API_URL` is set correctly
- Check backend `FRONTEND_URL` matches your frontend URL
- Inspect browser console for CORS errors
- Verify backend is running and healthy

### Database Connection Issues

- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify database username and password are correct
- Ensure connection string includes database name
- Check if your cluster is paused (free tier auto-pauses after inactivity)

### Email Notifications Not Working

- Verify Gmail App Password is correct
- Check EMAIL_HOST and EMAIL_PORT are correct
- Test email configuration with backend/testEmail.js
- Make sure 2-Step Verification is enabled in Gmail

### Free Tier Limitations

- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- MongoDB free tier has 512MB storage limit
- Consider upgrading for production use

---

## 🔄 Updating Your Deployment

### Automatic Deployment

Render automatically redeploys when you push to your main branch on GitHub.

### Manual Deployment

1. Go to your service on Render
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Environment Variable Changes

After changing environment variables, Render will automatically redeploy your service.

---

## 📊 Monitoring

### Render Dashboard

- View logs in real-time
- Monitor resource usage
- Check deployment status
- View metrics and analytics

### MongoDB Atlas

- Monitor database performance
- View query patterns
- Check storage usage
- Set up alerts

---

## 💰 Pricing Information

### Free Tier Includes:

**Render:**
- Static sites: Unlimited, always on
- Web services: 750 hours/month (enough for 1 service always on)
- Spins down after 15 minutes of inactivity
- 100GB bandwidth/month

**MongoDB Atlas:**
- 512 MB storage
- Shared RAM
- No credit card required
- Always-on (doesn't spin down)

**Upgrade When:**
- You need always-on backend (no spin-down)
- You exceed storage/bandwidth limits
- You need better performance
- You have production traffic

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Node.js Docs**: https://nodejs.org/docs/
- **React Docs**: https://react.dev/

---

## ✨ Success!

Your Hotel Website is now live and accessible from anywhere in the world! 🎉

**Next Steps:**
1. Add menu items via admin dashboard
2. Test all functionality
3. Share your website URL
4. Monitor logs and performance
5. Consider setting up a custom domain
6. Implement additional features as needed

---

**Made with ❤️ for Hotel Saloni - Punjabi Rasoi**

