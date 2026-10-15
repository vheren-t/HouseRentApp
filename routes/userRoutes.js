const router = require('express').Router();
const c = require('../controllers/userController');
const { auth } = require('../middlewares/authMiddleware');

router.post('/register', c.register);
router.post('/login', c.login);
router.post('/forgot-password', c.forgotPassword);
router.get('/properties', c.getProperties);
router.post('/book', auth('renter'), c.bookProperty);
router.get('/bookings', auth('renter'), c.myBookings);

module.exports = router;
