import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[RoyalChairs API] Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful Shutdown on Render / Cloud platforms
    const handleShutdown = (signal) => {
      console.log(`[RoyalChairs API] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('[RoyalChairs API] HTTP server closed.');
        try {
          await mongoose.connection.close(false);
          console.log('[RoyalChairs API] MongoDB connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('[RoyalChairs API] Error closing MongoDB connection:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('[RoyalChairs API] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();