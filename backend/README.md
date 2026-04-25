# 🏨 Hotel Mirador — Backend Node.js

API REST con **Express + Mongoose + MongoDB Atlas**

---

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración .env

Crea el archivo `.env` en la raíz (copia `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://yonatan:TU_PASSWORD@cluster0.uiqi4yo.mongodb.net/hotel_mirador?appName=Cluster0
JWT_SECRET=soyunsecret0123456789
```

> Reemplaza `TU_PASSWORD` con tu contraseña real de MongoDB Atlas.

## 🌱 Poblar la base de datos (solo 1 vez)

```bash
npm run seed
```

## ▶️ Arrancar el servidor

```bash
# Producción
npm start

# Desarrollo (con auto-reload)
npm run dev
```

El servidor queda en: **http://localhost:5000**

---

## 📡 Endpoints

### Habitaciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/habitaciones` | Listar todas |
| GET | `/api/v1/habitaciones/:tipo` | Detalle por tipo |
| POST | `/api/v1/habitaciones` | Crear habitación |
| PUT | `/api/v1/habitaciones/:id` | Actualizar habitación |

### Reservaciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/reservaciones` | Crear reservación |
| GET | `/api/v1/reservaciones` | Listar todas |
| GET | `/api/v1/reservaciones/:numero` | Buscar por número (MIR-ABC12345) |
| PATCH | `/api/v1/reservaciones/:id/estado` | Cambiar estado |
| DELETE | `/api/v1/reservaciones/:id` | Cancelar |

### Contacto
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/contacto` | Enviar mensaje |
| GET | `/api/v1/contacto` | Listar mensajes |
| PATCH | `/api/v1/contacto/:id/respondido` | Marcar respondido |

### Newsletter
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/newsletter` | Suscribirse |
| DELETE | `/api/v1/newsletter/:email` | Desuscribirse |
| GET | `/api/v1/newsletter` | Listar suscriptores |
