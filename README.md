# 🏨 Hotel Website - Punjabi Rasoi

A modern, responsive hotel website with restaurant management system built with React and Node.js.

## 🌟 Features

- **Frontend**: React with Framer Motion animations
- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas (cloud database)
- **Authentication**: JWT-based admin authentication
- **Email Notifications**: Gmail integration for admin alerts
- **Responsive Design**: Works on all devices
- **Admin Dashboard**: Complete management system
- **Menu Management**: Add, edit, delete menu items
- **Reservation System**: Online table booking
- **Order Management**: Food ordering with cart
- **Contact System**: Customer inquiry management

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account (for email notifications)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FRONT_END
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Edit backend/.env with your MongoDB Atlas credentials
   npm start
   ```

3. **Setup Frontend** (new terminal)
   ```bash
   cd ..
   npm install
   # Edit .env with your backend URL
   npm start
   ```

4. **Create Admin User**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin/login

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for Render
- **[SETUP.md](./SETUP.md)** - Detailed local development setup
- **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** - Environment variables reference
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment checklist

## 🌐 Live Demo

Once deployed, your website will be accessible at:
- **Frontend**: `https://your-frontend.onrender.com`
- **Backend API**: `https://your-backend.onrender.com`

## 🛠️ Tech Stack

### Frontend
- React 19
- Framer Motion (animations)
- React Router (routing)
- Styled Components
- Three.js (3D scenes)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer (email service)
- CORS enabled

### Database
- MongoDB Atlas (cloud)
- Collections: Users, MenuItems, Reservations, Orders, ContactMessages

## 📁 Project Structure

```
FRONT_END/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── utils/              # Email service
│   ├── .env                # Backend environment variables
│   └── server.js           # Entry point
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── context/            # State management
│   ├── utils/              # Utilities
│   └── config/             # API configuration
├── public/                 # Static assets
├── .env                    # Frontend environment variables
└── docs/                   # Documentation
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
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

## 🚀 Deployment

### Quick Deploy to Render

1. **Setup MongoDB Atlas**
   - Create free cluster
   - Get connection string
   - Configure network access

2. **Deploy Backend**
   - Create Web Service on Render
   - Set root directory: `backend`
   - Add environment variables
   - Deploy

3. **Deploy Frontend**
   - Create Static Site on Render
   - Set build command: `npm install && npm run build`
   - Set publish directory: `build`
   - Add `REACT_APP_API_URL` environment variable
   - Deploy

4. **Update CORS**
   - Update backend `FRONTEND_URL` with deployed frontend URL

5. **Create Admin User**
   - Use API to register admin user

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions.

## 🎯 Features Overview

### Public Features
- **Homepage**: Hero section with animations
- **Menu**: Browse food items by category
- **Cart**: Add items, adjust quantities, checkout
- **Reservations**: Book tables online
- **Contact**: Send inquiries to restaurant

### Admin Features
- **Dashboard**: Overview of messages, reservations, orders
- **Menu Management**: CRUD operations for menu items
- **Reservation Management**: View and update reservations
- **Order Management**: Track and update order status
- **Message Management**: View and respond to inquiries
- **Email Notifications**: Automatic alerts for new submissions

## 🔒 Security

- JWT-based authentication
- CORS protection
- Environment variable secrets
- MongoDB Atlas security
- HTTPS encryption (Render)
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface
- Optimized for mobile ordering

## 🎨 UI/UX Features

- Smooth animations with Framer Motion
- 3D restaurant scene
- Interactive menu with hover effects
- Real-time cart updates
- Loading states and error handling
- Success/error notifications

## 🔄 API Endpoints

### Public Endpoints
- `GET /api/menu` - Get menu items
- `POST /api/contact` - Submit contact form
- `POST /api/reservations` - Make reservation
- `POST /api/orders` - Place order

### Admin Endpoints (Protected)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Verify token
- `GET /api/messages` - Get contact messages
- `GET /api/reservations` - Get reservations
- `GET /api/orders` - Get orders
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads correctly
- [ ] Menu displays items
- [ ] Cart functionality works
- [ ] Contact form submits
- [ ] Reservation form works
- [ ] Admin login works
- [ ] Admin dashboard functions
- [ ] Email notifications work

## 🐛 Troubleshooting

### Common Issues
1. **Backend won't start**: Check environment variables
2. **Frontend shows errors**: Verify API URL
3. **Database connection fails**: Check MongoDB Atlas settings
4. **Email not working**: Verify Gmail App Password
5. **CORS errors**: Check FRONTEND_URL configuration

See **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** for detailed troubleshooting.

## 📊 Performance

- Optimized React build
- Image optimization
- Lazy loading
- Efficient API calls
- MongoDB indexing
- CDN delivery (Render)

## 🔮 Future Enhancements

- [ ] Payment integration
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Inventory management
- [ ] Staff management
- [ ] Customer reviews

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Check the documentation files
- Review the troubleshooting guides
- Open an issue on GitHub

## 🎉 Acknowledgments

- Built for Hotel Saloni - Punjabi Rasoi
- Designed with modern web standards
- Optimized for performance and user experience

---

**Made with ❤️ for authentic Punjabi cuisine experience**