const router      = require('express').Router();
const Habitacion  = require('../models/Habitacion');

// GET /api/v1/habitaciones
router.get('/', async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.disponible !== undefined)
      filtro.disponible = req.query.disponible === 'true';

    const habitaciones = await Habitacion.find(filtro);
    res.json(habitaciones);
  } catch (err) { next(err); }
});

// GET /api/v1/habitaciones/:tipo
router.get('/:tipo', async (req, res, next) => {
  try {
    const hab = await Habitacion.findOne({ tipo: req.params.tipo });
    if (!hab) return res.status(404).json({ error: `Habitación '${req.params.tipo}' no encontrada` });
    res.json(hab);
  } catch (err) { next(err); }
});

// POST /api/v1/habitaciones
router.post('/', async (req, res, next) => {
  try {
    const existe = await Habitacion.findOne({ tipo: req.body.tipo });
    if (existe) return res.status(409).json({ error: `Ya existe una habitación de tipo '${req.body.tipo}'` });

    const hab = await Habitacion.create(req.body);
    res.status(201).json(hab);
  } catch (err) { next(err); }
});

// PUT /api/v1/habitaciones/:id
router.put('/:id', async (req, res, next) => {
  try {
    const hab = await Habitacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hab) return res.status(404).json({ error: 'Habitación no encontrada' });
    res.json(hab);
  } catch (err) { next(err); }
});

module.exports = router;
