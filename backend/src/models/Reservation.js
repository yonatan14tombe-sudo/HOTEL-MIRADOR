const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habitacionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  guiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fechaEntrada: {
    type: Date,
    required: true
  },
  fechaSalida: {
    type: Date,
    required: true
  },
  huespedes: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  precioNoche: {
    type: Number,
    required: true
  },
  precioTotal: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    default: 'pendiente'
  },
  notas: {
    type: String,
    maxlength: 500
  },
  codigoReserva: {
    type: String,
    unique: true
  },
  fechaReserva: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generar código único de reserva
reservationSchema.pre('save', async function(next) {
  if (!this.codigoReserva) {
    const fecha = new Date();
    const random = Math.floor(Math.random() * 10000);
    this.codigoReserva = `HM-${fecha.getFullYear()}${(fecha.getMonth()+1).toString().padStart(2,'0')}${random}`;
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);