import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { services } from './config.services.js';
import { createServiceProxy } from './proxy/createpProxy.js';
import { attachUser } from './middleware/attach-user.js';
import { errorHandler } from './middleware/error-handler.js';
import { setupSwagger } from './swagger.js';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true
    })
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  );
  app.use(morgan('dev'));
  // Do not parse JSON on the gateway — bodies must stream through to microservices.

  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'API Gateway healthy' });
  });

  setupSwagger(app);

  app.use(attachUser);

  app.use('/auth', createServiceProxy({ target: services.auth, basePath: '/auth' }));
  app.use('/extinguishers', createServiceProxy({ target: services.extinguisher, basePath: '/extinguishers' }));
  app.use('/inspections', createServiceProxy({ target: services.inspection, basePath: '/inspections' }));
  app.use('/maintenance', createServiceProxy({ target: services.maintenance, basePath: '/maintenance' }));
  app.use('/reporting', createServiceProxy({ target: services.reporting, basePath: '/reporting' }));
  app.use('/users', createServiceProxy({ target: services.user, basePath: '/users' }));

  app.use(errorHandler);

  return app;
};