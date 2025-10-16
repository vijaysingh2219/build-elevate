import { formatDuration } from '@workspace/utils/helpers';
import cors from 'cors';
import express, { type Express, json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import corsOptions from './config/corsOptions';
import credentials from './middleware/credentials';
import { errorHandler } from './middleware/error';
import routes from './routes';

const isProd = process.env.NODE_ENV === 'production';

export const createServer = (): Express => {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: isProd ? undefined : false,
    }),
  );

  // Logging
  app.use(morgan(isProd ? 'combined' : 'dev'));

  // Body parsing
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Apply credentials middleware before CORS middleware
  app.use(credentials);

  // CORS
  app.use(cors(corsOptions));

  // Health check route
  app.get('/health', (_, res) => {
    const uptimeInSeconds = process.uptime();
    const uptime = formatDuration({ seconds: Math.floor(uptimeInSeconds) });
    const timestamp = new Date().toISOString();

    res.status(200).json({
      ok: true,
      uptime,
      timestamp,
    });
  });

  // API Routes
  app.use('/api', routes);

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.originalUrl });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};
