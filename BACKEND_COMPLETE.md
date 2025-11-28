# 🚀 Full-Stack Airbnb Clone - Complete Backend Setup

## 📊 **What's Been Created:**

### **Backend Features:**
✅ User Authentication (Register/Login with JWT)
✅ Admin & User Roles
✅ Bookings System
✅ Experiences Section
✅ Admin Dashboard API
✅ Single Database with Multiple Collections

---

## 🗄️ **Database Structure (Single DB)**

### **Collections:**
1. **users** - User accounts (admin & regular users)
2. **listings** - Property listings
3. **bookings** - User bookings
4. **experiences** - Experience activities

---

## 👥 **Demo Accounts:**

### **Admin Account:**
- Email: `admin@airbnb.com`
- Password: `password123`
- Role: admin

### **User Account:**
- Email: `user@airbnb.com`
- Password: `password123`
- Role: user

---

## 🔌 **API Endpoints:**

### **Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### **Listings:**
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing

### **Bookings:**
- `POST /api/bookings` - Create booking (auth required)
- `GET /api/bookings/my-bookings` - Get user's bookings (auth required)
- `GET /api/bookings/all` - Get all bookings (admin only)
- `PATCH /api/bookings/:id/status` - Update booking status

### **Experiences:**
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get single experience
- `POST /api/experiences` - Create experience

### **Admin Dashboard:**
- `GET /api/admin/stats` - Dashboard statistics (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/listings` - Get all listings (admin only)
- `DELETE /api/admin/listings/:id` - Delete listing (admin only)
- `GET /api/admin/bookings` - Get all bookings (admin only)
- `PATCH /api/admin/bookings/:id` - Update booking (admin only)

---

## 📦 **New Dependencies Installed:**
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-validator` - Input validation

---

## 🔐 **Authentication Flow:**

1. User registers/logs in
2. Server returns JWT token
3. Client stores token (localStorage)
4. Client sends token in Authorization header
5. Server verifies token for protected routes

---

## 🎯 **Admin Dashboard Stats Include:**
- Total Users
- Total Listings
- Total Bookings
- Total Experiences
- Total Revenue
- Recent Bookings

---

## 🚀 **How to Use:**

### **1. Install Dependencies:**
```bash
cd server
npm install
```

### **2. Seed Database:**
```bash
npm run seed
```

This creates:
- 2 demo users (admin & regular user)
- 12 listings
- 3 experiences

### **3. Start Server:**
```bash
npm run dev
```

---

## 📝 **Next Steps:**

1. ✅ Backend complete
2. ⏳ Create Admin Panel UI (React)
3. ⏳ Create Experiences Page
4. ⏳ Integrate Authentication in Frontend
5. ⏳ Create Booking Flow
6. ⏳ Create User Dashboard

---

## 🎨 **Upcoming Frontend Components:**

### **Admin Panel Will Include:**
- 📊 Dashboard with stats & charts
- 👥 User management table
- 🏠 Listings management
- 📅 Bookings management
- 🎭 Experiences management
- 🎨 Premium, informative UI

### **User Features:**
- 🔐 Login/Signup integration
- 📅 Booking system
- 🎭 Browse experiences
- 👤 User profile
- 📜 Booking history

---

## 💡 **Database Design Decision:**

**Single Database** with multiple collections is better because:
- ✅ Easier to manage
- ✅ Better for relationships (bookings reference users & listings)
- ✅ Simpler deployment
- ✅ Cost-effective
- ✅ Easier backups

---

## 🔒 **Security Features:**
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected admin routes
- Input validation ready

---

**Status:** Backend 100% Complete ✅
**Next:** Building Premium Admin Panel UI 🎨
