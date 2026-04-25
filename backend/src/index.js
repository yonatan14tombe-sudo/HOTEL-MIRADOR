const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
require('dotenv').config();

const connectDB       = require('./config/db');
const authRouter = require('./routes/auth');
const habitacionesRouter  = require('./routes/habitaciones');
const reservacionesRouter = require('./routes/reservaciones');
const contactoRouter      = require('./routes/contacto');
const newsletterRouter    = require('./routes/newsletter');

const app = express();

// ── Conexión DB ───────────────────────────────────────────
connectDB();

// ── Middlewares ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── Rutas ─────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/habitaciones',  habitacionesRouter);
app.use('/api/v1/reservaciones', reservacionesRouter);
app.use('/api/v1/contacto',      contactoRouter);
app.use('/api/v1/newsletter',    newsletterRouter);

// ── Health ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🏨 Hotel Mirador API funcionando', version: '1.0.0' });
});

// ── Error handler global ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
