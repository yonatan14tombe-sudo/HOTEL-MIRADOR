const mongoose = require('mongoose');

const reservacionSchema = new mongoose.Schema({
  nombre:         { type: String, required: true, trim: true },
  email:          { type: String, required: true, trim: true, lowercase: true },
  telefono:       { type: String, default: null },
  tipoHabitacion: { type: String, required: true },
  fechaEntrada:   { type: Date, required: true },
  fechaSalida:    { type: Date, required: true },
  huespedes:      { type: Number, required: true, min: 1, max: 8 },
  solicitudes:    { type: String, default: null },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    default: 'pendiente',
  },
  numeroReserva:  { type: String, unique: true },
  precioTotal:    { type: Number, default: 0 },
}, { timestamps: true });

// Generar número de reserva antes de guardar
reservacionSchema.pre('save', function (next) {
  if (!this.numeroReserva) {
    const letras  = Math.random().toString(36).substring(2, 5).toUpperCase();
    const numeros = Math.floor(10000 + Math.random() * 90000);
    this.numeroReserva = `MIR-${letras}${numeros}`;
  }
  next();
});

module.exports = mongoose.model('Reservacion', reservacionSchema);
