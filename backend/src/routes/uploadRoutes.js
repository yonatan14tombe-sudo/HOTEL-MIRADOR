const express    = require('express');
const router     = express.Router();
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const multer     = require('multer');
const upload     = multer({ storage: multer.memoryStorage() });

router.post('/foto', protect, upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ninguna imagen' });

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'hotel-mirador/usuarios', transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }] },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

module.exports = router;
