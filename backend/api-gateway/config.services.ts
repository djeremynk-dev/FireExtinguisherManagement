export const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  extinguisher: process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003',
  inspection: process.env.INSPECTION_SERVICE_URL || 'http://localhost:5004',
  maintenance: process.env.MAINTENANCE_SERVICE_URL || 'http://localhost:5005',
  reporting: process.env.REPORTING_SERVICE_URL || 'http://localhost:5006',
  user: process.env.USER_SERVICE_URL || 'http://localhost:5007'
};