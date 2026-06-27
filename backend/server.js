import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Route Imports
import authRoutes from './routes/auth.js';
import firmsRoutes from './routes/firms.js';
import quizRoutes from './routes/quiz.js';
import analyticsRoutes from './routes/analytics.js';
import challengesRoutes from './routes/challenges.js';
import reviewsRoutes from './routes/reviews.js';
import payoutsRoutes from './routes/payouts.js';
import offersRoutes from './routes/offers.js';
import loyaltyRoutes from './routes/loyalty.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/firms', firmsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/payouts', payoutsRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/loyalty', loyaltyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Serve frontend assets in production
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`Serving static production assets from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  console.log('Production frontend build not found. API server running in standalone mode.');
  app.get('/', (req, res) => {
    res.send('PropRules API Server is running. Start Vite dev server for frontend development.');
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[PropRules Server] Running at http://localhost:${PORT}`);
});
