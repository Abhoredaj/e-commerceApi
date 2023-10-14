const jwt = require('jsonwebtoken');
const jwtConfig = require('./jwt');

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }
  
    jwt.verify(token, jwtConfig.secretKey, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Unauthorized: Token has expired' });
        } else {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
      }
  
      // Attach the user's ID to the request for later use
      req.userId = decoded.userId;
      next();
    });
  }
  
module.exports = verifyToken;
  
