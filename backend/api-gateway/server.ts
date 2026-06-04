import 'dotenv/config';
import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.GATEWAY_PORT || 5000);

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
  console.log(`OpenAPI JSON: http://localhost:${port}/api-docs/openapi.json`);
});