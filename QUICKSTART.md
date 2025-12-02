# 🚀 Quick Start Guide - VEX Platform

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your MongoDB URI
# For local MongoDB: mongodb://localhost:27017/vex-platform
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/vex-platform
```

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, skip this step
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Browser
```
http://localhost:3000
```

---

## ✅ Verify Installation

Check if everything is working:

```bash
# Test API health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","message":"Server is running","database":"connected"}
```

---

## 📁 What's Included

- ✅ Next.js 14 with TypeScript
- ✅ React Three Fiber (Three.js)
- ✅ MongoDB integration (native + Mongoose)
- ✅ Tailwind CSS
- ✅ Environment configuration
- ✅ API health check endpoint
- ✅ TypeScript types

---

## 📚 Documentation

See **SETUP.pdf** for complete guide including:
- Detailed installation steps
- MongoDB setup (local & Atlas)
- Project structure explanation
- Implementation roadmap
- Troubleshooting tips
- Best practices

---

## 🎯 Next Steps

Now you're ready to implement:

1. **Authentication** - User registration/login
2. **3D Scene** - Three.js exhibition hall
3. **Database Models** - User, Booth, Product schemas
4. **Real-time Features** - WebSocket multiplayer
5. **Admin Panel** - Hall and booth management

---

## 🆘 Need Help?

### Common Issues

**MongoDB connection failed:**
```bash
# Make sure MongoDB is running
mongod --version
```

**Port 3000 already in use:**
```bash
# Use different port
npm run dev -- -p 3001
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

- 📖 Read SETUP.pdf for detailed guide
- 🔍 Check README.md for project info
- 💬 Create GitHub issue for bugs

---

**Version:** 0.1.0  
**Status:** Initial Setup Complete ✅  
**Ready to code!** 🎉
