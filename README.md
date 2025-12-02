# VEX Platform - Virtual Exhibition Platform

A 3D virtual exhibition platform built with Next.js, Three.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string
```

3. **Start MongoDB** (if using local)
```bash
mongod
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
vex-platform/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components (add as needed)
├── lib/                   # Utility functions
│   ├── mongodb.ts         # MongoDB connection
│   └── mongoose.ts        # Mongoose connection
├── types/                 # TypeScript types
│   └── index.ts           # Global type definitions
├── public/                # Static assets
├── .env.local             # Environment variables (not in git)
├── .env.example           # Environment template
└── package.json           # Dependencies

```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D Engine**: Three.js, React Three Fiber, Drei
- **Database**: MongoDB, Mongoose
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes

## 📚 Documentation

See `SETUP.pdf` for detailed setup instructions and implementation guide.

## 🔗 API Endpoints

- `GET /api/health` - Health check and database status

## 🧪 Testing Database Connection

```bash
curl http://localhost:3000/api/health
```

## 📝 Next Steps

1. Implement user authentication
2. Create 3D scene components
3. Build exhibition hall system
4. Add booth management
5. Implement real-time features

## 📄 License

MIT
