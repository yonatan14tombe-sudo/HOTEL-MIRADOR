const express = require('express');
const router = express.Router();
const {
  crearReserva,
  misReservas,
  obtenerReservaPorId,
  cancelarReserva,
  todasLasReservas
} = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/auth');
const { reservationValidation } = require('../middleware/validation');

router.post('/', protect, reservationValidation, crearReserva);
router.get('/mis-reservas', protect, misReservas);
router.get('/admin/todas', protect, adminOnly, todasLasReservas);
router.get('/:id', protect, obtenerReservaPorId);
router.put('/:id/cancelar', protect, cancelarReserva);

module.exports = router;