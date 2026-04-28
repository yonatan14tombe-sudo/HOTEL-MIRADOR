const Room = require('../models/Room');

const obtenerHabitaciones = async (req, res) => {
  try {
    const { tipo, disponible, orden } = req.query;
    let query = { activo: true };
    
    if (tipo) query.tipo = tipo;
    if (disponible === 'true') query.disponible = true;
    
    let habitacionesQuery = Room.find(query);
    
    if (orden === 'precio') {
      habitacionesQuery = habitacionesQuery.sort('precioBase');
    }
    
    const habitaciones = await habitacionesQuery;
    res.json(habitaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
};

const obtenerHabitacionPorId = async (req, res) => {
  try {
    const habitacion = await Room.findById(req.params.id);
    if (!habitacion) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }
    res.json(habitacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener habitación' });
  }
};

const crearHabitacion = async (req, res) => {
  try {
    const habitacion = await Room.create(req.body);
    res.status(201).json(habitacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear habitación' });
  }
};

const actualizarHabitacion = async (req, res) => {
  try {
    const habitacion = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!habitacion) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }
    res.json(habitacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar habitación' });
  }
};

const eliminarHabitacion = async (req, res) => {
  try {
    const habitacion = await Room.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!habitacion) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }
    res.json({ mensaje: 'Habitación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar habitación' });
  }
};

module.exports = {
  obtenerHabitaciones,
  obtenerHabitacionPorId,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion
};