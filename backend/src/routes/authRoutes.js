const express = require('express');
const router = express.Router();
const { registro, login, perfil, actualizarPerfil } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

router.post('/registro', registerValidation, registro);
router.post('/login', loginValidation, login);
router.get('/perfil', protect, perfil);
router.put('/perfil', protect, actualizarPerfil);

module.exports = router;