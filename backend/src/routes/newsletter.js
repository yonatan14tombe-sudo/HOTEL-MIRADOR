const router = require('express').Router();
const { Newsletter } = require('../models/Contacto');

// POST /api/v1/newsletter
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body;
    const existente = await Newsletter.findOne({ email });

    if (existente) {
      if (existente.activo)
        return res.json({ mensaje: 'Este email ya está suscrito al newsletter.', ...existente.toObject() });

      existente.activo = true;
      await existente.save();
      return res.json({ mensaje: '¡Suscripción reactivada exitosamente!', ...existente.toObject() });
    }

    const nuevo = await Newsletter.create({ email });
    res.status(201).json({
      mensaje: '¡Te has suscrito exitosamente al newsletter de Hotel Mirador!',
      ...nuevo.toObject(),
    });
  } catch (err) { next(err); }
});

// DELETE /api/v1/newsletter/:email
router.delete('/:email', async (req, res, next) => {
  try {
    const n = await Newsletter.findOneAndUpdate(
      { email: req.params.email },
      { activo: false },
      { new: true }
    );
    if (!n) return res.status(404).json({ error: 'Email no encontrado en la lista' });
    res.json({ mensaje: `El email ${req.params.email} fue eliminado del newsletter.` });
  } catch (err) { next(err); }
});

// GET /api/v1/newsletter
router.get('/', async (req, res, next) => {
  try {
    const activo = req.query.activo !== 'false';
    const lista  = await Newsletter.find({ activo }).sort({ createdAt: -1 });
    res.json(lista);
  } catch (err) { next(err); }
});

module.exports = router;
