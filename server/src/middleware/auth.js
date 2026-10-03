const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Enforces valid Bearer JWT token on request
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied: Authentication Bearer token required.' 
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Invalid or expired authentication token.' 
    });
  }
};

/**
 * Enforces role-based access control (RBAC)
 * @param  {...string} roles Allowed roles (e.g. 'super_admin', 'trainer', 'student')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Endpoint requires one of [${roles.join(', ')}]. Current role: '${req.user.role}'.` 
      });
    }
    next();
  };
};

/**
 * Non-blocking optional authentication
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      req.user = jwt.verify(token, config.jwtSecret);
    } catch (e) {
      // Ignored for optional auth
    }
  }
  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  optionalAuth
};
