const express = require('express');
const router = express.Router();
const { getUsuarios, cambiarRol, editarUsuario, eliminarUsuario } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

const esAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
  next();
};

router.get('/usuarios', protect, esAdmin, getUsuarios);
router.put('/usuarios/:id/rol', protect, esAdmin, cambiarRol);
router.put('/usuarios/:id', protect, esAdmin, editarUsuario);
router.delete('/usuarios/:id', protect, esAdmin, eliminarUsuario);

module.exports = router;
