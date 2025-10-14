const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se o header de autorização existe
  if (!authHeader) {
    return res.status(401).json({ message: 'Invalid credentials' }); // ou 'Token not provided'
  }

  // 2. Separa o "Bearer" do token
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Invalid credentials' }); // ou 'Token error'
  }
  
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Invalid credentials' }); // ou 'Token malformatted'
  }

  // 3. Valida o token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Se o erro for de expiração, a mensagem é específica
      if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid credentials' }); // ou 'Invalid Token'
    }

    // Adiciona os dados do payload (sub, username, role) ao objeto de requisição
    req.user = {
      id: decoded.sub,
      username: decoded.username,
      role: decoded.role,
    };
    
    return next();
  });
};