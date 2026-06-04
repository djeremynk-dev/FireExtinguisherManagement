import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const openApiPath = join(__dirname, '../docs/openapi.yaml');

export const loadOpenApiDocument = () => {
  const source = readFileSync(openApiPath, 'utf8');
  return yaml.parse(source) as Record<string, unknown>;
};

export const setupSwagger = (app: Express) => {
  const document = loadOpenApiDocument();

  app.get('/api-docs/openapi.yaml', (_req, res) => {
    res.type('text/yaml').send(readFileSync(openApiPath, 'utf8'));
  });

  app.get('/api-docs/openapi.json', (_req, res) => {
    res.json(document);
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(document, {
      customSiteTitle: 'TZW LTD Fire Safety API',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true
      }
    })
  );
};
