const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Invalid credentials' }); 
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Invalid credentials' }); 
  }
  
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Invalid credentials' }); 
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid credentials' }); 
    }

    req.user = {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role,
    };
    
    return next();
  });
};