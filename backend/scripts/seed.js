/**
 * Script de datos iniciales — Hotel Mirador
 * Ejecutar: node scripts/seed.js
 */

require('dotenv').config();
const mongoose   = require('mongoose');
const Habitacion = require('../src/models/Habitacion');

const HABITACIONES = [
  {
    tipo:        'suite_presidencial',
    nombre:      'Suite Presidencial',
    descripcion: 'Nuestra suite más exclusiva con terraza privada y vistas panorámicas a las montañas.',
    precioNoche: 450000,
    capacidad:   2,
    metros2:     85,
    cama:        'King Size',
    vista:       'Montaña',
    amenidades:  ['Jacuzzi', 'Terraza privada', 'Minibar', 'Smart TV 65"', 'Bata y pantuflas', 'Servicio de mayordomo'],
    disponible:  true,
    imagenUrl:   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    badge:       'Premium',
  },
  {
    tipo:        'doble',
    nombre:      'Habitación Doble',
    descripcion: 'Perfecta para parejas, con decoración elegante y todas las comodidades modernas.',
    precioNoche: 280000,
    capacidad:   2,
    metros2:     45,
    cama:        'Queen Size',
    vista:       'Jardín',
    amenidades:  ['Ducha lluvia', 'Smart TV', 'Caja fuerte', 'Minibar', 'Aire acondicionado'],
    disponible:  true,
    imagenUrl:   'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    badge:       'Popular',
  },
  {
    tipo:        'suite_familiar',
    nombre:      'Suite Familiar',
    descripcion: 'Amplio espacio para toda la familia con dos ambientes y área de entretenimiento.',
    precioNoche: 380000,
    capacidad:   4,
    metros2:     70,
    cama:        '2 Camas',
    vista:       'Jardín y Montaña',
    amenidades:  ['Smart TV 55"', 'Sala de estar', 'Cocina equipada', '2 baños completos', 'Área de juegos'],
    disponible:  true,
    imagenUrl:   'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    badge:       null,
  },
  {
    tipo:        'individual',
    nombre:      'Habitación Individual',
    descripcion: 'Diseñada para viajeros de negocios que buscan confort y tranquilidad.',
    precioNoche: 180000,
    capacidad:   1,
    metros2:     28,
    cama:        'Single',
    vista:       'Jardín',
    amenidades:  ['Escritorio ejecutivo', 'Smart TV', 'Ducha', 'WiFi de alta velocidad', 'Caja fuerte'],
    disponible:  true,
    imagenUrl:   'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    badge:       null,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('\n🌱 Conectado a MongoDB...');

  let insertadas = 0, omitidas = 0;

  for (const hab of HABITACIONES) {
    const existe = await Habitacion.findOne({ tipo: hab.tipo });
    if (existe) {
      console.log(`  ⚠️  '${hab.tipo}' ya existe — omitida`);
      omitidas++;
    } else {
      await Habitacion.create(hab);
      console.log(`  ✅ '${hab.nombre}' insertada`);
      insertadas++;
    }
  }

  console.log(`\n📊 Resumen: ${insertadas} insertadas, ${omitidas} omitidas`);
  console.log('🏨 ¡Base de datos lista!\n');
  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
