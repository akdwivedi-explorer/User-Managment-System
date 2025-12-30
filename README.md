# User Management System

A full-stack user management application with role-based access control, featuring user authentication, profile management, and an admin dashboard for user administration.

> **Note:** The assessment brief mentioned AI simulation in the video section, but the project title and core tasks defined a User Management System, which has been implemented accordingly.

## 🚀 Features

### Authentication & Authorization
- **User Registration**: Create new accounts with email and password
- **User Login**: Secure authentication with JWT tokens
- **Password Security**: Passwords are hashed using bcryptjs before storage
- **Token-based Authentication**: JWT tokens with 1-day expiration
- **Role-based Access Control**: Separate permissions for users and admins
- **Account Status Management**: Users can be activated or deactivated

### User Features
- View personal profile information
- Update profile details (full name, email)
- Change password securely
- View account role and status
- Protected routes requiring authentication

### Admin Features
- **User Dashboard**: View all registered users in a paginated table
- **User Management**: Toggle user status (active/inactive)
- **Pagination Support**: Browse users with configurable page size
- **Role-based UI**: Admin-only routes and components

### Technical Features
- **RESTful API**: Clean API architecture with Express.js
- **MongoDB Integration**: Scalable database solution with Mongoose
- **Responsive UI**: Modern, mobile-friendly interface with TailwindCSS
- **Real-time Feedback**: Toast notifications for user actions
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error handling and validation

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd User-Managment-System
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/user-management-system
JWT_SECRET=your-secret-key
```

**Important Notes:**
- Replace `MONGO_URI` with your MongoDB connection string
- For **MongoDB Atlas**, use the connection string provided by your cluster (format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`)
- For **local MongoDB**, ensure MongoDB service is running and use the connection string above
- **JWT_SECRET**: Use a strong, random string for production (minimum 32 characters recommended)

### Frontend API Configuration

The frontend API base URL is configured in `frontend/src/services/api.jsx`. 

**Note**: The default API URL is set to `http://localhost:3000/api`. If your backend runs on a different port (default is 5000), you'll need to update this:

```javascript
// In frontend/src/services/api.jsx
const API_URL = 'http://localhost:5000/api'; // Update to match your backend port
```

## 🚀 Running the Application

### Start MongoDB

**Local MongoDB:**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

**MongoDB Atlas:** No local setup needed, just ensure your connection string is correct in `.env`

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000` (or the port specified in your `.env` file).

You should see:
```
MongoDB connected successfully
Server is running on port 5000
```

### Start the Frontend Development Server

Open a new terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite's default port).

## 📁 Project Structure

```
PurpleMeritAssignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection configuration
│   │   ├── controllers/
│   │   │   ├── adminController.js # Admin operations (get users, update status)
│   │   │   ├── authController.js  # Authentication logic (signup, login)
│   │   │   └── userController.js  # User operations (get/update profile)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js  # JWT authentication & role authorization
│   │   ├── model/
│   │   │   └── User.js            # User Mongoose schema
│   │   └── routes/
│   │       ├── adminRoute.js      # Admin API routes
│   │       ├── authRoute.js       # Authentication API routes
│   │       └── userRoute.js       # User API routes
│   ├── index.js                   # Express server entry point
│   ├── package.json
│   └── .env                       # Environment variables (create this)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   └── UI.jsx         # Reusable UI components (Button, Input)
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx     # Navigation bar component
    │   │   │   └── ProtectedRoute.jsx # Route protection wrapper
    │   │   └── DashboardTable.jsx # User table component for admin
    │   ├── context/
    │   │   └── AuthContext.jsx    # Authentication context provider
    │   ├── pages/
    │   │   ├── Dashboard.jsx      # Admin dashboard page
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Profile.jsx        # User profile page
    │   │   └── Signup.jsx         # Registration page
    │   ├── services/
    │   │   └── api.jsx            # API service layer with axios
    │   ├── App.jsx                # Main app component with routing
    │   ├── main.jsx               # React entry point
    │   └── index.css              # Global styles
    ├── package.json
    ├── vite.config.js             # Vite configuration
    └── tailwind.config.js         # TailwindCSS configuration
```

## 🔐 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Login user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "lastLogin": "2024-01-01T12:00:00.000Z"
  }
}
```

### User Routes (Protected - Requires Authentication)

#### GET `/api/users/profile`
Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "status": "active",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### PUT `/api/users/profile`
Update authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123" // optional
}
```

**Response (200):**
```json
{
  "_id": "user_id",
  "fullName": "John Updated",
  "email": "john.updated@example.com"
}
```

### Admin Routes (Protected - Requires Admin Role)

#### GET `/api/admin/users`
Get all users with pagination (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Example:** `/api/admin/users?page=1&limit=10`

**Response (200):**
```json
{
  "users": [
    {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

#### PATCH `/api/admin/users/:id/status`
Update user status (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response (200):**
```json
{
  "message": "User status updated successfully"
}
```

## 👤 User Roles

### User
- Default role for registered users
- Can view and edit their own profile
- Can change their password
- Cannot access admin routes

### Admin
- Can access admin dashboard
- Can view all users with pagination
- Can activate/deactivate any user account
- Has access to all user routes

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs (salt rounds: 12 for signup, 10 for updates)
- **JWT Authentication**: Secure token-based authentication with 1-day expiration
- **Protected Routes**: Middleware to protect API endpoints requiring authentication
- **Role-based Authorization**: Admin middleware to restrict admin-only routes
- **Account Status Check**: Inactive users cannot login
- **CORS Configuration**: Enabled for secure cross-origin requests
- **Password Exclusion**: Passwords are excluded from user queries where not needed

## 🎨 Frontend Routes

- `/login` - Login page (public)
- `/signup` - Registration page (public)
- `/profile` - User profile page (protected, all authenticated users)
- `/admin` - Admin dashboard (protected, admin only)
- `*` - Redirects to `/login` for undefined routes

## 📝 Available Scripts

### Backend
- `npm start` - Start the development server with nodemon (auto-reload on changes)

### Frontend
- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production (creates `dist` folder)
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🔍 Data Model

### User Schema
```javascript
{
  email: String (required, unique),
  fullName: String (required),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated),
  lastLogin: Date (updated on login)
}
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Ensure MongoDB is running (for local setup)
- Verify `MONGO_URI` in `.env` is correct
- Check network connectivity (for MongoDB Atlas)
- Verify credentials in connection string

**Port Already in Use**
- Change `PORT` in `.env` file
- Or kill the process using the port:
  ```bash
  # Find process
  lsof -i :5000
  # Kill process
  kill -9 <PID>
  ```

**JWT Token Errors**
- Ensure `JWT_SECRET` is set in `.env`
- Token expires after 1 day, user needs to login again

### Frontend Issues

**API Connection Error**
- Verify backend server is running
- Check API URL in `frontend/src/services/api.jsx` matches backend port
- Ensure CORS is enabled in backend
- Check browser console for detailed error messages

**Authentication Not Working**
- Check if token is stored in `localStorage` (key: `currentUser`)
- Verify token is being sent in request headers
- Clear browser storage and login again

**Build Errors**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## 🚀 Deployment Considerations

### Backend
- Set `NODE_ENV=production` in production
- Use a strong `JWT_SECRET` (at least 32 characters)
- Use MongoDB Atlas or secure MongoDB instance
- Configure CORS to allow only your frontend domain
- Use environment variables for all sensitive data
- Consider using PM2 or similar for process management

### Frontend
- Update API URL in `api.jsx` to production backend URL
- Build for production: `npm run build`
- Serve `dist` folder using a web server (Nginx, Apache, etc.)
- Configure routing to serve `index.html` for all routes (SPA routing)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

**Ashutosh Dwivedi**

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Note:** 
- Make sure MongoDB is running before starting the backend server
- For production deployments, use secure environment variables and a strong JWT secret
- Update the API URL in the frontend to match your production backend URL

