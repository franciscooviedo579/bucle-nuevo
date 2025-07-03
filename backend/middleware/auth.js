const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, 'SECRET_KEY'); // Usa tu clave secreta real
    req.user = payload;
    next();
  } catch (e) {
    res.sendStatus(403);
  }
}

module.exports = authenticateToken;
