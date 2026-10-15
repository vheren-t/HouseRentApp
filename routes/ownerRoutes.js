const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const c = require('../controllers/ownerController');
const { auth, ownerGranted } = require('../middlewares/authMiddleware');

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (_r, f, cb) => cb(null, `${Date.now()}-${f.originalname.replace(/\s+/g, '_')}`),
  }),
  fileFilter: (_r, f, cb) => cb(null, f.mimetype.startsWith('image/')),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(auth('owner'), ownerGranted);
router.post('/properties', upload.array('propertyImage', 5), c.addProperty);
router.get('/properties', c.myProperties);
router.put('/properties/:id', c.updateProperty);
router.delete('/properties/:id', c.deleteProperty);
router.get('/bookings', c.ownerBookings);
router.put('/bookings/:id', c.updateBookingStatus);

module.exports = router;
