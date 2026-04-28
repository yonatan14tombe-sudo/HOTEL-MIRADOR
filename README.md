# 🏨 Hotel Mirador Colombia

> Sistema web completo para la gestión y presentación del **Hotel Mirador**, un hotel de lujo ubicado en **Villa de Leyva, Boyacá, Colombia**.

🌐 **Demo en vivo**: [hotelmiradorcolombia.netlify.app](https://hotelmiradorcolombia.netlify.app)  
⚙️ **API Backend**: [hotel-mirador-backend.onrender.com](https://hotel-mirador-backend.onrender.com)  
📦 **Repositorio**: [github.com/yonatan14tombe-sudo/HOTEL-MIRADOR](https://github.com/yonatan14tombe-sudo/HOTEL-MIRADOR)

---

## ✨ ¿Qué hace este proyecto?

- 🏠 Página principal con carrusel de 12 fotos en el hero
- 🛏️ Catálogo de **20 habitaciones** ordenadas por precio con carrusel interactivo
- 🧖 Sección de **servicios y amenidades** (piscina, spa, restaurante, bar, gimnasio, concierge, parqueadero, playas, cabalgatas y más)
- 📅 **Sistema de reservas** completo con fechas, huéspedes y guía turístico
- 💳 **Pasarela de pagos** con tarjeta, PSE y transferencia
- 🔐 **Autenticación** con registro, login y foto de perfil
- 👑 **Panel de administración** para gestionar usuarios y roles
- 📱 Diseño **responsive** para móvil y escritorio
- 📲 Botones de **WhatsApp, Instagram y Facebook**

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Backend | Node.js + Express.js |
| Base de datos | MongoDB Atlas |
| Autenticación | JWT + bcrypt |
| Imágenes | Cloudinary |
| Frontend Deploy | Netlify |
| Backend Deploy | Render |

---

## 🚀 Cómo clonar y ejecutar localmente

### Requisitos
- Node.js v18+
- Git

### 1 — Clonar
```bash
git clone https://github.com/yonatan14tombe-sudo/HOTEL-MIRADOR.git
cd HOTEL-MIRADOR
```

### 2 — Backend
```bash
cd backend
npm install
```

Crear archivo `.env` en `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://yonatan:tombe2314@cluster0.uiqi4yo.mongodb.net/hotel_mirador?retryWrites=true&w=majority
JWT_SECRET=mi_clave_secreta_super_segura_2024
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=doqgzkabi
CLOUDINARY_API_KEY=654935547615748
CLOUDINARY_API_SECRET=hUmi89H9xSSxqN_0-BB3HqQ8JFs
```

Iniciar backend:
```bash
npm start
```
> Corre en `http://localhost:5000`

### 3 — Frontend
```bash
cd ../fronent
npx serve .
```
> Abre en `http://localhost:3000`

---

## 📁 Estructura                                 ---

## 🔐 Roles del sistema

| Rol | Permisos |
|-----|----------|
| **Usuario** | Ver el sitio |
| **Cliente** | Ver y gestionar sus reservas |
| **Guía** | Perfil público, asignación a reservas |
| **Encargado** | Panel de gestión de reservas |
| **Admin** | Control total del sistema |

---

## 📡 API Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/auth/registro` | Registrar usuario | No |
| POST | `/api/v1/auth/login` | Iniciar sesión | No |
| GET | `/api/v1/rooms` | Listar habitaciones | No |
| POST | `/api/v1/reservations` | Crear reserva | Sí |
| GET | `/api/v1/reservations/mis-reservas` | Mis reservas | Sí |
| GET | `/api/v1/guides` | Listar guías | No |
| GET | `/api/v1/admin/usuarios` | Gestionar usuarios | Admin |
| PUT | `/api/v1/admin/usuarios/:id/rol` | Cambiar rol | Admin |

---

## 🔑 Credenciales de prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| **Admin** | mariofajardo22@hotmail.com | 106170 |
| **Encargado** | oeimartombe@gmail.com | 106170 |

> ⚠️ Solo para evaluación académica.

---

## 👨‍💻 Desarrollado por

**Yonatan Tombe**  
🐙 [@yonatan14tombe-sudo](https://github.com/yonatan14tombe-sudo)

---

## 📄 Licencia

MIT License
