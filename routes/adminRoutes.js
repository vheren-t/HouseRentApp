const router = require('express').Router();
const c = require('../controllers/adminController');
const { auth } = require('../middlewares/authMiddleware');

router.use(auth('admin'));
router.get('/users', c.allUsers);
router.put('/users/:id/grant', c.setGrant);
router.get('/properties', c.allProperties);
router.get('/bookings', c.allBookings);

module.exports = router;
