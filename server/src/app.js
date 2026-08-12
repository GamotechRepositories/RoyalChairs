import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Royal Chairs Express API & Mongoose Auth Service is active',
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);

// Catch 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`,
  });
});

export default app;