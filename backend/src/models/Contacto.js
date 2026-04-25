const mongoose = require('mongoose');

// ── Contacto ──────────────────────────────────────────────
const contactoSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  telefono:  { type: String, default: null },
  motivo: {
    type: String,
    enum: ['reserva', 'informacion', 'queja', 'otro'],
    default: 'informacion',
  },
  mensaje:    { type: String, required: true },
  respondido: { type: Boolean, default: false },
}, { timestamps: true });

// ── Newsletter ─────────────────────────────────────────────
const newsletterSchema = new mongoose.Schema({
  email:  { type: String, required: true, unique: true, lowercase: true },
  activo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = {
  Contacto:   mongoose.model('Contacto',   contactoSchema),
  Newsletter: mongoose.model('Newsletter', newsletterSchema),
};
