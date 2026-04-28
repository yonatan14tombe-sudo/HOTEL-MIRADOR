const User = require('../models/User');
const Guide = require('../models/Guide');

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['usuario', 'cliente', 'guia', 'encargado', 'admin'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const user = await User.findByIdAndUpdate(
      id, { rol }, { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Si el rol es guia, crear perfil automáticamente
    if (rol === 'guia') {
      const guiaExistente = await Guide.findOne({ usuarioId: id });
      if (!guiaExistente) {
        await Guide.create({
          usuarioId: id,
          especialidad: 'cultural',
          descripcion: 'Guía turístico del Hotel Mirador. Perfil pendiente de completar.',
          idiomas: ['español'],
          disponibilidad: true,
          calificacion: 5,
          experiencias: []
        });
      }
    }

    res.json({ mensaje: `Rol actualizado a ${rol}`, usuario: user });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar rol' });
  }
};

const editarUsuario = async (req, res) => {
  try {
    const { nombre, email, telefono, activo } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email, telefono, activo },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario actualizado', usuario: user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await Guide.findOneAndDelete({ usuarioId: req.params.id });
    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = { getUsuarios, cambiarRol, editarUsuario, eliminarUsuario };
