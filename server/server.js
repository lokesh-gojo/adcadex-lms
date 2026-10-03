/**
 * Acadex LMS Server Entry Point
 * Architecture: Modular Express API with Role-Based Access Control (RBAC),
 * hardened sterile code execution sandbox, and persistent multi-tenant data layer.
 */
const app = require('./src/app');
const config = require('./src/config');

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`⚡ ACADEX LMS API SERVER RUNNING SECURELY`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🛡️  Environment: ${config.nodeEnv.toUpperCase()}`);
  console.log(`🔒 Security: Helmet, Rate-Limiting, JWT, Sandbox Isolation`);
  console.log(`=======================================================`);
});

module.exports = { app, server };
