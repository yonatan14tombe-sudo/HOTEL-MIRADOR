const User = require('../models/User');
const Guide = require('../models/Guide');
const Reservation = require('../models/Reservation');

const obtenerGuias = async (req, res) => {
  try {
    const guias = await Guide.find({ disponibilidad: true })
      .populate('usuarioId', 'nombre email telefono');
    res.json(guias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener guías' });
  }
};

const obtenerGuiaPorId = async (req, res) => {
  try {
    const guia = await Guide.findById(req.params.id)
      .populate('usuarioId', 'nombre email telefono');
    if (!guia) return res.status(404).json({ error: 'Guía no encontrado' });
    res.json(guia);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener guía' });
  }
};

const obtenerMiPerfil = async (req, res) => {
  try {
    const guia = await Guide.findOne({ usuarioId: req.user.id })
      .populate('usuarioId', 'nombre email telefono');
    if (!guia) return res.status(404).json({ error: 'Perfil de guía no encontrado' });
    res.json(guia);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { especialidad, descripcion, idiomas, disponibilidad, experiencias, foto } = req.body;
    const guia = await Guide.findOneAndUpdate(
      { usuarioId: req.user.id },
      { especialidad, descripcion, idiomas, disponibilidad, experiencias, foto },
      { new: true, runValidators: true }
    ).populate('usuarioId', 'nombre email telefono');

    if (!guia) return res.status(404).json({ error: 'Perfil no encontrado' });
    res.json({ mensaje: 'Perfil actualizado', guia });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

const crearGuia = async (req, res) => {
  try {
    const { usuarioId, especialidad, descripcion, idiomas } = req.body;
    const guiaExistente = await Guide.findOne({ usuarioId });
    if (guiaExistente) return res.status(400).json({ error: 'Este usuario ya es guía' });
    const guia = await Guide.create({ usuarioId, especialidad, descripcion, idiomas });
    await User.findByIdAndUpdate(usuarioId, { rol: 'guia' });
    res.status(201).json(guia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear guía' });
  }
};

const guiaAsignado = async (req, res) => {
  try {
    const reserva = await Reservation.findOne({
      usuarioId: req.user.id,
      guiaId: { $ne: null },
      estado: 'confirmada'
    }).populate('guiaId', 'nombre email telefono');

    if (!reserva || !reserva.guiaId) {
      return res.json({ tieneGuia: false });
    }

    const guiaInfo = await Guide.findOne({ usuarioId: reserva.guiaId._id });
    res.json({
      tieneGuia: true,
      guia: {
        nombre: reserva.guiaId.nombre,
        email: reserva.guiaId.email,
        telefono: reserva.guiaId.telefono,
        especialidad: guiaInfo?.especialidad,
        descripcion: guiaInfo?.descripcion
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener guía asignado' });
  }
};

module.exports = { obtenerGuias, obtenerGuiaPorId, crearGuia, guiaAsignado, obtenerMiPerfil, actualizarPerfil };
