const jwt     = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const proteger = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return res.status(401).json({ error: 'No autorizado — token requerido' });

    const token   = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select('-password');
    if (usuario || !usuario.activo)
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });

    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin')
    return res.status(403).json({ error: 'Acceso denegado' });
  next();
};

module.exports = { proteger, soloAdmin };
