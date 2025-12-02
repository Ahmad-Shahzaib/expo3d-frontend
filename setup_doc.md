# VEX Platform - Setup & Implementation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [MongoDB Setup](#mongodb-setup)
5. [Project Structure](#project-structure)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Next Steps for Implementation](#next-steps-for-implementation)
10. [Troubleshooting](#troubleshooting)

---

## 1. Project Overview

**VEX Platform** is a 3D virtual exhibition platform that provides immersive exhibition experiences with professional 3D navigation similar to video games.

### Key Features (To Be Implemented)
- 3D Exhibition Halls with WASD navigation
- Booth Management System
- Real-time multiplayer interactions
- Video/Audio chat capabilities
- Analytics and reporting
- Admin, Booth Owner, and Visitor roles

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **3D Engine**: Three.js with React Three Fiber
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io (to be added)

---

## 2. System Requirements

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **MongoDB**: v6.0 or higher
- **Git**: Latest version

### Recommended
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space
- **Browser**: Chrome, Firefox, or Edge (latest versions)
- **OS**: Windows 10/11, macOS 12+, or Ubuntu 20.04+

---

## 3. Installation Guide

### Step 1: Install Node.js
```bash
# Check if Node.js is installed
node --version

# If not installed, download from:
# https://nodejs.org/ (LTS version recommended)
```

### Step 2: Install MongoDB

#### Option A: Local Installation
**Windows:**
```bash
# Download MongoDB Community Server from:
# https://www.mongodb.com/try/download/community
# Follow installation wizard
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Use in `.env.local`

### Step 3: Clone or Download Project
```bash
# If you have the project folder, navigate to it
cd vex-platform

# Install dependencies
npm install
```

---

## 4. MongoDB Setup

### Local MongoDB
```bash
# Start MongoDB service
mongod

# In another terminal, verify connection
mongosh
> show dbs
> exit
```

### MongoDB Atlas
1. Login to MongoDB Atlas
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password

---

## 5. Project Structure

```
vex-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── health/              # Health check endpoint
│   │       └── route.ts
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── lib/                         # Utility functions
│   ├── mongodb.ts               # MongoDB native driver connection
│   └── mongoose.ts              # Mongoose ORM connection
│
├── types/                       # TypeScript definitions
│   └── index.ts                 # Global types
│
├── components/                  # React components (empty - to be added)
│
├── public/                      # Static files
│
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Environment template
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md                    # Project readme
```

---

## 6. Environment Configuration

### Create `.env.local` file
```bash
cp .env.example .env.local
```

### Configure Variables
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/vex-platform
MONGODB_DB=vex-platform

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# JWT Secret (generate a strong secret for production)
JWT_SECRET=dev-secret-key-change-in-production
```

### For MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vex-platform?retryWrites=true&w=majority
```

---

## 7. Running the Application

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Access the Application
- **URL**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

---

## 8. API Documentation

### Health Check Endpoint
**Endpoint**: `GET /api/health`

**Response (Success)**:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

**Response (Error)**:
```json
{
  "status": "error",
  "message": "Database connection failed",
  "error": "Connection timeout"
}
```

### Testing with cURL
```bash
curl http://localhost:3000/api/health
```

---

## 9. Next Steps for Implementation

### Phase 1: Authentication System
- [ ] Create user registration API
- [ ] Implement login/logout
- [ ] Add JWT token management
- [ ] Create protected routes

### Phase 2: Database Models
- [ ] User model (Admin, Booth Owner, Visitor)
- [ ] Exhibition Hall model
- [ ] Booth model
- [ ] Product model
- [ ] Analytics model

### Phase 3: 3D Scene
- [ ] Create basic Three.js scene
- [ ] Implement WASD navigation
- [ ] Add camera controls
- [ ] Create exhibition hall environment

### Phase 4: Booth System
- [ ] Booth creation interface
- [ ] Product upload system
- [ ] Booth customization
- [ ] Interactive elements

### Phase 5: Real-time Features
- [ ] WebSocket integration
- [ ] Multiplayer avatars
- [ ] Chat system
- [ ] Video calling (Agora.io)

### Phase 6: Admin Panel
- [ ] Hall creation
- [ ] Booth allocation
- [ ] User management
- [ ] Analytics dashboard

---

## 10. Troubleshooting

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
# Windows: Start MongoDB service from Services
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found Errors

**Problem**: Module not found after installation

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Problem**: Type errors in IDE

**Solution**:
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

### Environment Variables Not Loading

**Problem**: `.env.local` not working

**Solution**:
- Ensure file is named exactly `.env.local`
- Restart development server after changes
- Check for typos in variable names
- Public variables must start with `NEXT_PUBLIC_`

---

## Additional Resources

### Official Documentation
- **Next.js**: https://nextjs.org/docs
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **MongoDB**: https://www.mongodb.com/docs/
- **Mongoose**: https://mongoosejs.com/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

### Community & Support
- **GitHub Issues**: Create issues for bugs
- **Next.js Discord**: https://nextjs.org/discord
- **Three.js Discord**: https://discord.gg/poimandres

---

## Security Checklist (Before Production)

- [ ] Change JWT_SECRET to strong random string
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable CORS properly
- [ ] Add rate limiting
- [ ] Implement input validation
- [ ] Add HTTPS/SSL certificates
- [ ] Configure CSP headers
- [ ] Remove console.logs
- [ ] Add error monitoring (Sentry)
- [ ] Set up backup system

---

## Performance Optimization Tips

1. **3D Scene Optimization**
   - Use LOD (Level of Detail) for distant objects
   - Implement frustum culling
   - Optimize textures and models
   - Use instanced meshes for repeated objects

2. **Database Optimization**
   - Add proper indexes
   - Use aggregation pipelines
   - Implement caching with Redis
   - Use connection pooling

3. **Next.js Optimization**
   - Enable image optimization
   - Use dynamic imports
   - Implement code splitting
   - Add proper caching headers

---

## Deployment Guide (Future)

### Recommended Platforms
- **Vercel**: Best for Next.js (automatic deployments)
- **AWS**: Full control, scalable
- **DigitalOcean**: Cost-effective, simple
- **Railway**: Easy database + app hosting

### Environment Variables in Production
- Set all `.env.local` variables in platform dashboard
- Never commit `.env.local` to git
- Use strong secrets for JWT_SECRET

---

## Development Workflow

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
```bash
# Edit files
# Test locally
npm run dev
```

3. **Commit Changes**
```bash
git add .
git commit -m "Add: feature description"
```

4. **Push and Create PR**
```bash
git push origin feature/your-feature-name
```

---

## Contact & Support

For questions or issues:
- Check documentation first
- Search existing GitHub issues
- Create new issue with detailed description
- Include error messages and screenshots

---

**Last Updated**: December 2025
**Version**: 0.1.0
**Status**: Initial Setup Complete

