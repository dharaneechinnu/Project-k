// authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer format
  if (!token) return res.status(401).send('Access denied. No token provided.');

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token.');
    req.user = decoded; // Attach user information to request
    next();
  });
};

module.exports = verifyToken;
