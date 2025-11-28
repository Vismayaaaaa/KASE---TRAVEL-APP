# Airbnb Clone - Full Stack Setup

## 🎯 Current Status

### ✅ Completed:
- Frontend (React + Vite)
- Backend API (Express + MongoDB)
- Seed script with 12 listings
- API integration in frontend

### ⏳ Pending:
- MongoDB installation

## 📋 Quick Start Guide

### Step 1: Install MongoDB

**Option A: Local Installation (Recommended)**
1. Download: https://www.mongodb.com/try/download/community
2. Install with "Install as Service" option
3. MongoDB will start automatically

**Option B: Cloud (MongoDB Atlas)**
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Get connection string
4. Update `.env` with your connection string

### Step 2: Seed the Database

```bash
cd server
npm run seed
```

This will:
- ✅ Clear existing data
- ✅ Add 12 new listings
- ✅ Show success message

### Step 3: Start Backend Server

```bash
cd server
npm run dev
```

Server runs on: `http://localhost:5000`

### Step 4: Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🔄 How It Works

### Frontend → Backend Flow:
1. Frontend fetches from `http://localhost:5000/api/listings`
2. If API fails, falls back to mock data
3. Shows warning banner if server is offline

### Seed Script:
- **Clears** all existing listings
- **Adds** 12 fresh listings
- **Safe** to run multiple times

## 🛠️ Troubleshooting

### "MongoDB not running" error:
```bash
# Check if MongoDB service is running
Get-Service MongoDB

# Or start MongoDB manually
mongod
```

### Frontend shows warning:
- Make sure backend server is running (`npm run dev` in server folder)
- Check `http://localhost:5000/api/listings` in browser

## 📁 Project Structure

```
airbnb-clone/
├── client/              # React frontend
│   ├── src/
│   │   ├── services/    # API calls
│   │   ├── pages/       # HomePage, LoginPage, etc.
│   │   └── components/  # Reusable components
│   └── package.json
│
└── server/              # Express backend
    ├── index.js         # API server
    ├── seed.js          # Database seeder
    ├── .env             # MongoDB connection
    └── package.json
```

## 🎨 Features

- ✅ 12 Indonesian listings
- ✅ Real-time API integration
- ✅ Fallback to mock data
- ✅ Loading skeletons
- ✅ Error handling
- ✅ Premium UI design

## 🚀 Next Steps

1. Install MongoDB
2. Run `npm run seed`
3. Start both servers
4. Enjoy your full-stack Airbnb clone!
