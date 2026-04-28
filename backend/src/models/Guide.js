const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  especialidad: {
    type: String,
    required: true,
    enum: ['montaña', 'ciudad', 'naturaleza', 'aventura', 'cultural']
  },
  descripcion: {
    type: String,
    required: true
  },
  idiomas: [{
    type: String,
    enum: ['español', 'inglés', 'francés', 'alemán', 'portugués']
  }],
  disponibilidad: {
    type: Boolean,
    default: true
  },
  calificacion: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  experiencias: [{
    titulo: String,
    descripcion: String,
    duracion: Number,
    precio: Number
  }],
  foto: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guide', guideSchema);