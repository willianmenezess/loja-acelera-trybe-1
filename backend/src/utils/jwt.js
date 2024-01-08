const jwt = require('jsonwebtoken');
const HttpException = require('./httpException');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecret';
const JWT_CONFIG = { expiresIn: '15m', algorithm: 'HS256' };
const createToken = (payload) => jwt.sign(payload, JWT_SECRET, JWT_CONFIG);

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    throw new HttpException(401, error.message);
  }
};

module.exports = { createToken, verifyToken };