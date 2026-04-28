const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['premium', 'sencilla', 'suite', 'doble', 'familiar'],
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  capacidad: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  camas: {
    type: String,
    required: true
  },
  tamanio: {
    type: Number,
    required: true
  },
  precioBase: {
    type: Number,
    required: true,
    min: 0
  },
  preciosTemporada: {
    alta: { type: Number, default: 0 },
    media: { type: Number, default: 0 },
    baja: { type: Number, default: 0 }
  },
  servicios: [{
    type: String,
    enum: ['wifi', 'tv', 'minibar', 'aire', 'jacuzzi', 'vista_montaña', 'terraza', 'desayuno']
  }],
  imagenes: [{
    type: String
  }],
  disponible: {
    type: Boolean,
    default: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema, 'habitacions');