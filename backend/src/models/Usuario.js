const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  telefono:  { type: String, default: null },
  rol:       { type: String, enum: ['huesped', 'admin'], default: 'huesped' },
  activo:    { type: Boolean, default: true },
}, { timestamps: true });

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

usuarioSchema.methods.compararPassword = async function (passwordIngresado) {
  return bcrypt.compare(passwordIngresado, this.password);
};

usuarioSchema.set('toJSON', {
  transform: (_, obj) => { delete obj.password; return obj; }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
