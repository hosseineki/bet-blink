import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Import routes
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';
import publicRoutes from './routes/public';

// Create main app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:8081'], // Add your frontend URLs
  credentials: true,
}));

// Error handling middleware
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  
  return c.json({
    success: false,
    message: 'Internal server error',
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Route not found',
  }, 404);
});

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/protected', protectedRoutes);
app.route('/api', publicRoutes);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'BetBlink API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      protected: '/api/protected',
      public: '/api',
    },
  });
});

// Start server
const port = process.env.PORT || 3001;

console.log(`🚀 Server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
