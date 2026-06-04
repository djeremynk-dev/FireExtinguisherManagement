# API Documentation (OpenAPI / Swagger)

## Swagger UI

With the API Gateway running on port **5000**:

| Resource | URL |
|----------|-----|
| Interactive docs | http://localhost:5000/api-docs |
| OpenAPI JSON | http://localhost:5000/api-docs/openapi.json |
| OpenAPI YAML (source) | http://localhost:5000/api-docs/openapi.yaml |

## Using authenticated endpoints

1. Call `POST /auth/login` or `POST /auth/register` from Swagger or your client.
2. Copy `data.accessToken` from the response.
3. In Swagger UI, click **Authorize** and enter: `Bearer <your-access-token>`
4. Try protected routes (extinguishers, inspections, users, etc.).

## Spec file

The canonical contract lives at `backend/docs/openapi.yaml` (OpenAPI 3.0.3). It documents all gateway routes for:

- Auth, Users, Extinguishers, Inspections, Maintenance, Reporting

Update this file when adding or changing API endpoints, then restart the gateway.
