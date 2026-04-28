const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Error de validación',
      detalles: errors.array() 
    });
  }
  next();
};

const registerValidation = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio').trim(),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono').optional().isMobilePhone().withMessage('Teléfono inválido'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  validate
];

const reservationValidation = [
  body('habitacionId').notEmpty().withMessage('Habitación requerida'),
  body('fechaEntrada').isISO8601().withMessage('Fecha de entrada inválida'),
  body('fechaSalida').isISO8601().withMessage('Fecha de salida inválida'),
  body('huespedes').isInt({ min: 1, max: 6 }).withMessage('Número de huéspedes inválido'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  reservationValidation
};