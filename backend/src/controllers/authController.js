const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const registro = async (req, res) => {
  try {
    const { nombre, email, password, telefono, foto } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      telefono,
      foto
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono,
        foto: user.foto || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar password
    const isMatch = await user.compararPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar si está activo
    if (!user.activo) {
      return res.status(401).json({ error: 'Usuario desactivado' });
    }

    // Generar token
    const token = generateToken(user._id);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono,
        foto: user.foto || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const perfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono, foto } = req.body;
    const updateData = { nombre, telefono };
    if (foto) updateData.foto = foto;
    const user = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    console.log('Perfil actualizado:', user.nombre, 'foto:', user.foto);
    res.json({ mensaje: 'Perfil actualizado', usuario: user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

module.exports = {
  registro,
  login,
  perfil,
  actualizarPerfil
};