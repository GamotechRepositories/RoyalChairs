import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Trust proxy for Render / Vercel reverse proxy headers (e.g. X-Forwarded-Proto)
app.set('trust proxy', 1);

app.use(helmet());

// Parse origins from environment variables (supporting comma-separated lists)
const parseOrigins = (rawOrigins) => {
  if (!rawOrigins) return [];
  return rawOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
};

const configuredOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.ADMIN_URL),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);

      // Check configured exact origins
      if (configuredOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any vercel.app preview and production subdomains
      if (/\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // In non-production or default permissive fallback
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // In strict production if not matched
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Endpoints (Root & /api/health for Render/monitoring)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Royal Chairs API Service is online and operational',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Royal Chairs Express API & Mongoose Auth Service is active',
    timestamp: new Date().toISOString(),
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

// Catch 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`,
  });
});

export default app;