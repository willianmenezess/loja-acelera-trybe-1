const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, _res, next) => {
  try {
    const { authorization } = req.headers;
    const payload = verifyToken(authorization);
    req.account = { 
      accountId: payload.id,
      status: payload.status, 
      isAdmin: payload.isAdmin,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;