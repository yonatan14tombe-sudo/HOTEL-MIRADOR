const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const User = require('../models/User');

const calcularPrecioTotal = async (habitacionId, fechaEntrada, fechaSalida) => {
  const habitacion = await Room.findById(habitacionId);
  if (!habitacion) throw new Error('Habitación no encontrada');
  
  const dias = Math.ceil((new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24));
  return habitacion.precioBase * dias;
};

const crearReserva = async (req, res) => {
  try {
    const { habitacionId, fechaEntrada, fechaSalida, huespedes, notas } = req.body;
    
    // Verificar disponibilidad
    const habitacion = await Room.findById(habitacionId);
    if (!habitacion || !habitacion.disponible) {
      return res.status(400).json({ error: 'Habitación no disponible' });
    }
    
    // Verificar conflictos de fechas
    const reservasExistentes = await Reservation.find({
      habitacionId,
      estado: { $in: ['pendiente', 'confirmada'] },
      $or: [
        { fechaEntrada: { $lt: fechaSalida, $gte: fechaEntrada } },
        { fechaSalida: { $gt: fechaEntrada, $lte: fechaSalida } }
      ]
    });
    
    if (reservasExistentes.length > 0) {
      return res.status(400).json({ error: 'La habitación no está disponible en esas fechas' });
    }
    
    const precioTotal = await calcularPrecioTotal(habitacionId, fechaEntrada, fechaSalida);
    
    // Asignar guía aleatorio si está disponible
    const guias = await User.find({ rol: 'guia', activo: true });
    const guiaId = guias.length > 0 ? guias[Math.floor(Math.random() * guias.length)]._id : null;
    
    const reserva = await Reservation.create({
      usuarioId: req.user.id,
      habitacionId,
      guiaId,
      fechaEntrada,
      fechaSalida,
      huespedes,
      precioNoche: habitacion.precioBase,
      precioTotal,
      notas
    });
    
    // Cambiar rol a cliente solo si es usuario básico
    if (req.user.rol === "usuario") {
        await User.findByIdAndUpdate(req.user.id, { rol: "cliente" });
    }


    const reservaCompleta = await Reservation.findById(reserva._id)
      .populate('habitacionId', 'nombre numero tipo')
      .populate('usuarioId', 'nombre email telefono');
    
    res.status(201).json({
      mensaje: 'Reserva creada exitosamente',
      reserva: reservaCompleta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
};

const misReservas = async (req, res) => {
  try {
    const reservas = await Reservation.find({ usuarioId: req.user.id })
      .populate('habitacionId', 'nombre numero tipo imagenes')
      .populate('guiaId', 'nombre email telefono')
      .sort('-fechaReserva');
    
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

const obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reservation.findById(req.params.id)
      .populate('habitacionId')
      .populate('usuarioId', 'nombre email telefono')
      .populate('guiaId', 'nombre email telefono');
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    // Verificar permisos
    if (reserva.usuarioId._id.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para ver esta reserva' });
    }
    
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
};

const cancelarReserva = async (req, res) => {
  try {
    const reserva = await Reservation.findById(req.params.id);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    if (reserva.usuarioId.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva' });
    }
    
    if (reserva.estado === 'cancelada') {
      return res.status(400).json({ error: 'La reserva ya está cancelada' });
    }
    
    if (reserva.estado === 'completada') {
      return res.status(400).json({ error: 'No se puede cancelar una reserva completada' });
    }
    
    reserva.estado = 'cancelada';
    await reserva.save();
    
    res.json({ mensaje: 'Reserva cancelada exitosamente', reserva });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
};

// Admin: Obtener todas las reservas
const todasLasReservas = async (req, res) => {
  try {
    const reservas = await Reservation.find()
      .populate('habitacionId', 'nombre numero')
      .populate('usuarioId', 'nombre email')
      .populate('guiaId', 'nombre email')
      .sort('-fechaReserva');
    
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

module.exports = {
  crearReserva,
  misReservas,
  obtenerReservaPorId,
  cancelarReserva,
  todasLasReservas
};