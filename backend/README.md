# 🔧 Backend API - Hotel Website

RESTful API for the Hotel Website built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB Atlas credentials
   ```

3. **Start server**:
   ```bash
   npm start        # Production
   npm run dev      # Development with nodemon
   ```

4. **Test health endpoint**:
   ```bash
   curl http://localhost:5000/health
   ```

## 📁 Project Structure

```
backend/
├── models/           # Database models
│   ├── User.js
│   ├── MenuItem.js
│   ├── Reservation.js
│   ├── Order.js
│   └── ContactMessage.js
├── routes/           # API routes
│   ├── auth.js
│   ├── menu.js
│   ├── reservations.js
│   ├── orders.js
│   ├── contact.js
│   └── messages.js
├── middleware/       # Custom middleware
│   └── verifyToken.js
├── utils/            # Utility functions
│   └── emailService.js
├── .env              # Environment variables
├── server.js         # Main server file
└── package.json
```

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/menu` | Get all menu items |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/reservations` | Make reservation |
| POST | `/api/orders` | Place order |

### Protected Endpoints (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Verify token |
| GET | `/api/messages` | Get contact messages |
| GET | `/api/reservations` | Get reservations |
| GET | `/api/orders` | Get orders |
| POST | `/api/menu` | Add menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |

## 🔐 Authentication

Uses JWT (JSON Web Tokens) for admin authentication:

1. **Login**: POST `/api/auth/login` with username/password
2. **Get Token**: Response includes JWT token
3. **Use Token**: Include `Authorization: Bearer <token>` header
4. **Verify**: GET `/api/auth/me` to verify token

## 📧 Email Notifications

Configured to send email notifications for:
- New contact messages
- New reservations
- New orders

Uses Gmail SMTP with App Password authentication.

## 🗄️ Database Models

### User
```javascript
{
  username: String,
  password: String (hashed),
  createdAt: Date
}
```

### MenuItem
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  createdAt: Date
}
```

### Reservation
```javascript
{
  name: String,
  email: String,
  phone: String,
  date: Date,
  time: String,
  guests: Number,
  specialRequests: String,
  status: String,
  createdAt: Date
}
```

### Order
```javascript
{
  customerName: String,
  phone: String,
  whatsapp: String,
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  totalPrice: Number,
  status: String,
  createdAt: Date
}
```

### ContactMessage
```javascript
{
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: Date
}
```

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email password | `your-app-password` |
| `ADMIN_EMAIL` | Admin notification email | `admin@example.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Get Menu Items
```bash
curl http://localhost:5000/api/menu
```

### Create Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```bash
docker build -t hotel-backend .
docker run -p 5000:5000 hotel-backend
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- Environment variable secrets
- MongoDB injection protection

## 📊 Monitoring

- Health check endpoint
- Error logging
- Database connection monitoring
- Email delivery tracking

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGO_URI format
   - Verify network access in MongoDB Atlas
   - Ensure credentials are correct

2. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token format in requests
   - Ensure token is not expired

3. **Email Not Working**
   - Verify Gmail App Password
   - Check EMAIL_* environment variables
   - Ensure 2-Step Verification is enabled

4. **CORS Errors**
   - Check FRONTEND_URL configuration
   - Verify frontend URL matches exactly
   - Test with different browsers

## 📚 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **nodemailer**: Email service
- **dotenv**: Environment variables

## 🔄 API Versioning

Current version: v1
- All endpoints under `/api/`
- Health check at `/health`
- Future versions will use `/api/v2/`

## 📝 Logging

- Console logging for development
- Error logging for production
- Request/response logging (optional)
- Database query logging (optional)

---

**Backend API ready for production! 🚀**
