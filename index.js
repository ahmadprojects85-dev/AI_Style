// ══════════════════════════════════════════════════
//  StyleAI — Backend Server
//  Express + Neon PostgreSQL + Drizzle ORM
// ══════════════════════════════════════════════════
import './env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import wardrobeRoutes from './routes/wardrobe.js';
import fitCheckRoutes from './routes/fitCheck.js';
import outfitRoutes from './routes/outfits.js';
import weatherRoutes from './routes/weather.js';
import chatRoutes from './routes/chat.js';

// Middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ══════════════════════════
// Security & Middleware
// ══════════════════════════
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
    if (!origin || process.env.NODE_ENV === 'development' || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', message: 'Please try again later' },
});
app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts', message: 'Please try again later' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ══════════════════════════
// API Routes
// ══════════════════════════
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/fit-check', fitCheckRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'StyleAI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ══════════════════════════
// Error Handling
// ══════════════════════════
app.use(notFound);
app.use(errorHandler);

// ══════════════════════════
// Start Server
// ══════════════════════════
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║                                      ║');
  console.log('  ║   ✦  StyleAI Server                  ║');
  console.log(`  ║   →  http://localhost:${PORT}            ║`);
  console.log(`  ║   →  Environment: ${process.env.NODE_ENV || 'development'}     ║`);
  console.log('  ║   →  Database: Neon PostgreSQL        ║');
  console.log('  ║                                      ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
  console.log('  API Routes:');
  console.log('  ├── POST   /api/auth/register');
  console.log('  ├── POST   /api/auth/login');
  console.log('  ├── GET    /api/auth/me');
  console.log('  ├── GET    /api/profile');
  console.log('  ├── PUT    /api/profile');
  console.log('  ├── POST   /api/profile/avatar');
  console.log('  ├── POST   /api/profile/complete-onboarding');
  console.log('  ├── GET    /api/wardrobe');
  console.log('  ├── GET    /api/wardrobe/:id');
  console.log('  ├── POST   /api/wardrobe');
  console.log('  ├── PUT    /api/wardrobe/:id');
  console.log('  ├── DELETE /api/wardrobe/:id');
  console.log('  ├── PATCH  /api/wardrobe/:id/favorite');
  console.log('  ├── PATCH  /api/wardrobe/:id/wear');
  console.log('  ├── GET    /api/wardrobe/stats/summary');
  console.log('  ├── POST   /api/fit-check');
  console.log('  ├── GET    /api/fit-check/history');
  console.log('  ├── GET    /api/fit-check/:id');
  console.log('  ├── GET    /api/outfits/suggestion');
  console.log('  ├── POST   /api/outfits');
  console.log('  ├── GET    /api/outfits/history');
  console.log('  ├── GET    /api/outfits/:id');
  console.log('  ├── DELETE /api/outfits/:id');
  console.log('  └── GET    /api/health');
  console.log('');
});

export default app;
// Trigger restart for env variables
// Second restart for env encoding fix
// Third restart for BOM purge
