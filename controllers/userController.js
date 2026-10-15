const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

exports.register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    if (!name || !email || !password || !['renter', 'owner'].includes(type))
      return res.status(400).json({ message: 'Semua field wajib diisi dengan benar' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    await User.create({ name, email, type, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(401).json({ message: 'Email atau password salah' });
    const token = jwt.sign({ id: user._id, type: user.type }, process.env.JWT_KEY, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, type: user.type, granted: user.granted } });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword || newPassword.length < 6)
      return res.status(400).json({ message: 'Email dan password baru (min. 6 karakter) wajib diisi' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password berhasil direset' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// Publik: dipakai landing page & dashboard renter
exports.getProperties = async (_req, res) => {
  res.json(await Property.find().sort({ createdAt: -1 }));
};

exports.bookProperty = async (req, res) => {
  try {
    const { propertyId, userName, phone } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Properti tidak ditemukan' });
    if (property.isAvailable !== 'Available')
      return res.status(400).json({ message: 'Properti tidak tersedia' });
    const booking = await Booking.create({
      propertyId, ownerID: property.ownerId, userID: req.user.id, userName, phone, bookingStatus: 'pending',
    });
    res.status(201).json(booking);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.myBookings = async (req, res) => {
  res.json(await Booking.find({ userID: req.user.id }).sort({ createdAt: -1 }));
};
