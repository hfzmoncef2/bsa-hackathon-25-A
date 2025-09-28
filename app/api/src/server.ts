import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import farmerRoutes from './routes/farmer';
import { logger } from './utils/logger';
import { AppConfig } from './types';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rainguard';

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Routes
app.use('/api/farmers', farmerRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'RainGuard Insurance API',
    version: '1.0.0',
    endpoints: {
      farmers: '/api/farmers',
      health: '/health'
    }
  });
});

// Middleware de gestion d'erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date()
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date()
  });
});

// Connexion à MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      logger.info(`RainGuard API server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

// Gestion des signaux de fermeture
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

export default app;
