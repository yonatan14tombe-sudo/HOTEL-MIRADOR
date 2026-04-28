// seedData.js (en la raíz del proyecto)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Room = require('./src/models/Room');
const Guide = require('./src/models/Guide');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Room.deleteMany({});
    await Guide.deleteMany({});

    console.log('🗑️ Datos anteriores eliminados');

    // Crear usuarios
    const admin = await User.create({
      nombre: 'Administrador',
      email: 'admin@hotelmirador.com',
      password: 'admin123',
      rol: 'admin',
      telefono: '+57 300 000 0000'
    });
    console.log('✅ Admin creado');

    const guia1 = await User.create({
      nombre: 'Carlos Mendoza',
      email: 'carlos@hotelmirador.com',
      password: 'guia123',
      rol: 'guia',
      telefono: '+57 310 987 6543'
    });
    console.log('✅ Guía 1 creado');

    const guia2 = await User.create({
      nombre: 'Ana Torres',
      email: 'ana@hotelmirador.com',
     password: 'guia123',
      rol: 'guia',
      telefono: '+57 320 456 7890'
    });
    console.log('✅ Guía 2 creado');

    // Crear cliente demo
    const cliente = await User.create({
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      password: '123456',
      rol: 'cliente',
      telefono: '+57 301 234 5678'
    });
    console.log('✅ Cliente demo creado');

    // Crear habitaciones
    const habitaciones = await Room.create([
      {
        numero: '101',
        nombre: 'Suite Presidencial',
        tipo: 'premium',
        descripcion: 'Nuestra suite más exclusiva con terraza privada y vistas panorámicas a las montañas.',
        capacidad: 2,
        camas: 'King Size',
        tamanio: 85,
        precioBase: 450000,
        preciosTemporada: { alta: 550000, media: 450000, baja: 350000 },
        servicios: ['wifi', 'tv', 'minibar', 'aire', 'jacuzzi', 'vista_montaña', 'terraza', 'desayuno'],
        disponible: true
      },
      {
        numero: '102',
        nombre: 'Habitación Doble',
        tipo: 'doble',
        descripcion: 'Perfecta para parejas, con decoración elegante y todas las comodidades modernas.',
        capacidad: 2,
        camas: 'Queen Size',
        tamanio: 45,
        precioBase: 280000,
        preciosTemporada: { alta: 350000, media: 280000, baja: 220000 },
        servicios: ['wifi', 'tv', 'minibar', 'aire', 'vista_jardin', 'desayuno'],
        disponible: true
      },
      {
        numero: '201',
        nombre: 'Suite Familiar',
        tipo: 'familiar',
        descripcion: 'Amplio espacio para toda la familia con dos ambientes y área de entretenimiento.',
        capacidad: 4,
        camas: '2 Camas Queen',
        tamanio: 70,
        precioBase: 380000,
        preciosTemporada: { alta: 480000, media: 380000, baja: 300000 },
        servicios: ['wifi', 'tv', 'minibar', 'aire', 'terraza', 'desayuno'],
        disponible: true
      }
    ]);
    console.log(`✅ ${habitaciones.length} habitaciones creadas`);

    // Crear guías
    await Guide.create([
      {
        usuarioId: guia1._id,
        especialidad: 'montaña',
        descripcion: 'Experto en rutas de montaña y senderismo ecológico',
        idiomas: ['español', 'inglés'],
        disponibilidad: true,
        calificacion: 4.8
      },
      {
        usuarioId: guia2._id,
        especialidad: 'cultural',
        descripcion: 'Especialista en historia local y arquitectura colonial',
        idiomas: ['español', 'inglés', 'francés'],
        disponibilidad: true,
        calificacion: 4.9
      }
    ]);
    console.log('✅ Guías creados');

    console.log('\n📋 DATOS DE ACCESO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN:');
    console.log('   Email: admin@hotelmirador.com');
    console.log('   Password: admin123');
    console.log('\n👤 CLIENTE DEMO:');
    console.log('   Email: juan@example.com');
    console.log('   Password: 123456');
    console.log('\n🗺️ GUÍAS:');
    console.log('   Email: carlos@hotelmirador.com / guia123');
    console.log('   Email: ana@hotelmirador.com / guia123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n✅ Datos iniciales cargados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    process.exit(1);
  }
};

seedData();