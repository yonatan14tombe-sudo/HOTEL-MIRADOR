const router   = require('express').Router();
const jwt      = require('jsonwebtoken');
const Usuario  = require('../models/Usuario');
const { proteger } = require('../middleware/auth');

function generarToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/registro', async (req, res, next) => {
  try {
    const { nombre, email, password, telefono } = req.body;
    if (!nombre || !email || !password)
      return res.status(422).json({ error: 'Nombre, email y contraseña son obligatorios' });
    if (password.length < 6)
      return res.status(422).json({ error: 'La contraseña debe tener mínimo 6 caracteres' });
    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    const usuario = await Usuario.create({ nombre, email, password, telefono });
    const token   = generarToken(usuario._id);
    res.status(201).json({ mensaje: `¡Bienvenido ${usuario.nombre}!`, token, usuario });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(422).json({ error: 'Email y contraseña son obligatorios' });
    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario)
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    const ok = await usuario.compararPassword(password);
    if (!ok)
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    const token = generarToken(usuario._id);
    res.json({ mensaje: `¡Bienvenido de vuelta, ${usuario.nombre}!`, token, usuario });
  } catch (err) { next(err); }
});

router.get('/perfil', proteger, (req, res) => res.json(req.usuario));

router.get('/mis-reservaciones', proteger, async (req, res, next) => {
  try {
    const Reservacion = require('../models/Reservacion');
    const reservaciones = await Reservacion.find({ email: req.usuario.email }).sort({ createdAt: -1 });
    res.json(reservaciones);
  } catch (err) { next(err); }
});

module.exports = router;
