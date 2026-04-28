// src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500', 'http://192.168.101.3:3000', 'https://hotelmiradorcolombia.netlify.app'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check mejorado
app.get('/api/v1/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'OK',
    message: 'Hotel Mirador API funcionando correctamente',
    database: dbStatus[dbState] || 'unknown',
    timestamp: new Date()
  });
});

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const contactoRoutes = require('./routes/contacto');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const guideRoutes = require('./routes/guideRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Rutas API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contacto', contactoRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/guides', guideRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', require('./routes/uploadRoutes'));

// Ruta para /habitaciones (transforma images a imagenes)
app.get("/api/v1/habitaciones", async (req, res) => {
  try {
    const Room = require("./models/Room");
    const rooms = await Room.find();
    const transformed = rooms.map(room => ({
      ...room.toObject(),
      imagenes: room.images || []
    }));
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor SOLO después de conectar a la DB
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/v1/health`);
    console.log(`💾 Base de datos: ${mongoose.connection.db.databaseName}`);
  });
}).catch(err => {
  console.error('❌ No se pudo iniciar el servidor:', err);
  process.exit(1);
});