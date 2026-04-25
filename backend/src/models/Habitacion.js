const mongoose = require('mongoose');

const habitacionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['suite_presidencial', 'doble', 'suite_familiar', 'individual'],
    required: true,
    unique: true,
  },
  nombre:       { type: String, required: true },
  descripcion:  { type: String, required: true },
  precioNoche:  { type: Number, required: true },
  capacidad:    { type: Number, required: true },
  metros2:      { type: Number, required: true },
  cama:         { type: String, required: true },
  vista:        { type: String, required: true },
  amenidades:   [String],
  disponible:   { type: Boolean, default: true },
  imagenUrl:    { type: String, default: null },
  badge:        { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Habitacion', habitacionSchema);
