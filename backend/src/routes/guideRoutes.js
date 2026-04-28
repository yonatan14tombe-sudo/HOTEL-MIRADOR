const express = require('express');
const router = express.Router();
const { obtenerGuias, obtenerGuiaPorId, crearGuia, guiaAsignado, obtenerMiPerfil, actualizarPerfil } = require('../controllers/guideController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', obtenerGuias);
router.get('/mi-perfil', protect, obtenerMiPerfil);
router.get('/mi-guia', protect, guiaAsignado);
router.get('/:id', obtenerGuiaPorId);
router.post('/', protect, adminOnly, crearGuia);
router.put('/mi-perfil', protect, actualizarPerfil);

module.exports = router;
