const router      = require('express').Router();
const Reservacion = require('../models/Reservacion');

const PRECIOS = {
  suite_presidencial: 450000,
  doble:              280000,
  suite_familiar:     380000,
  individual:         180000,
};

function calcularPrecio(tipo, entrada, salida) {
  const noches = Math.max(1, Math.ceil((new Date(salida) - new Date(entrada)) / 86400000));
  return (PRECIOS[tipo] || 280000) * noches;
}

// POST /api/v1/reservaciones  — crear
router.post('/', async (req, res, next) => {
  try {
    const { tipoHabitacion, fechaEntrada, fechaSalida } = req.body;

    if (new Date(fechaSalida) <= new Date(fechaEntrada))
      return res.status(422).json({ error: 'La fecha de salida debe ser posterior a la de entrada' });

    // Verificar disponibilidad
    const conflicto = await Reservacion.findOne({
      tipoHabitacion,
      estado:       { $nin: ['cancelada'] },
      fechaEntrada: { $lt: new Date(fechaSalida) },
      fechaSalida:  { $gt: new Date(fechaEntrada) },
    });
    if (conflicto)
      return res.status(409).json({ error: 'No hay disponibilidad para esas fechas en la habitación seleccionada' });

    const precioTotal = calcularPrecio(tipoHabitacion, fechaEntrada, fechaSalida);
    const reservacion = await Reservacion.create({ ...req.body, precioTotal });

    res.status(201).json({
      ...reservacion.toObject(),
      mensaje: `✅ Reservación creada. Número de confirmación: ${reservacion.numeroReserva}`,
    });
  } catch (err) { next(err); }
});

// GET /api/v1/reservaciones  — listar
router.get('/', async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.estado)          filtro.estado = req.query.estado;
    if (req.query.tipoHabitacion)  filtro.tipoHabitacion = req.query.tipoHabitacion;

    const reservaciones = await Reservacion.find(filtro).sort({ createdAt: -1 }).limit(200);
    res.json(reservaciones);
  } catch (err) { next(err); }
});

// GET /api/v1/reservaciones/:numero  — buscar por número
router.get('/:numero', async (req, res, next) => {
  try {
    const r = await Reservacion.findOne({ numeroReserva: req.params.numero.toUpperCase() });
    if (!r) return res.status(404).json({ error: `Reservación '${req.params.numero}' no encontrada` });
    res.json(r);
  } catch (err) { next(err); }
});

// PATCH /api/v1/reservaciones/:id/estado  — actualizar estado
router.patch('/:id/estado', async (req, res, next) => {
  try {
    const r = await Reservacion.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    if (!r) return res.status(404).json({ error: 'Reservación no encontrada' });
    res.json(r);
  } catch (err) { next(err); }
});

// DELETE /api/v1/reservaciones/:id  — cancelar
router.delete('/:id', async (req, res, next) => {
  try {
    const r = await Reservacion.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelada' },
      { new: true }
    );
    if (!r) return res.status(404).json({ error: 'Reservación no encontrada' });
    res.json({ mensaje: `Reservación ${r.numeroReserva} cancelada exitosamente` });
  } catch (err) { next(err); }
});

module.exports = router;
