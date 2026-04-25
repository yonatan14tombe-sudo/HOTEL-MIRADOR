const router   = require('express').Router();
const { Contacto } = require('../models/Contacto');

// POST /api/v1/contacto
router.post('/', async (req, res, next) => {
  try {
    const contacto = await Contacto.create(req.body);
    res.status(201).json({
      ...contacto.toObject(),
      mensajeConfirmacion: `¡Gracias ${contacto.nombre}! Tu mensaje fue recibido. Te contactaremos pronto.`,
    });
  } catch (err) { next(err); }
});

// GET /api/v1/contacto
router.get('/', async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.respondido !== undefined)
      filtro.respondido = req.query.respondido === 'true';

    const mensajes = await Contacto.find(filtro).sort({ createdAt: -1 });
    res.json(mensajes);
  } catch (err) { next(err); }
});

// PATCH /api/v1/contacto/:id/respondido
router.patch('/:id/respondido', async (req, res, next) => {
  try {
    const c = await Contacto.findByIdAndUpdate(
      req.params.id,
      { respondido: true },
      { new: true }
    );
    if (!c) return res.status(404).json({ error: 'Mensaje no encontrado' });
    res.json(c);
  } catch (err) { next(err); }
});

module.exports = router;
