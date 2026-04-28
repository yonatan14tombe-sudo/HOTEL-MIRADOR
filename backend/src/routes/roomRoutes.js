const express = require('express');
const router = express.Router();
const {
  obtenerHabitaciones,
  obtenerHabitacionPorId,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion
} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', obtenerHabitaciones);
router.get('/:id', obtenerHabitacionPorId);
router.post('/', protect, adminOnly, crearHabitacion);
router.put('/:id', protect, adminOnly, actualizarHabitacion);
router.delete('/:id', protect, adminOnly, eliminarHabitacion);

module.exports = router;