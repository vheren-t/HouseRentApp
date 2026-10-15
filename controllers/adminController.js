const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

exports.allUsers = async (_req, res) => res.json(await User.find().select('-password'));
exports.allProperties = async (_req, res) => res.json(await Property.find());
exports.allBookings = async (_req, res) => res.json(await Booking.find());

exports.setGrant = async (req, res) => {
  const { granted } = req.body;
  if (!['granted', 'ungranted'].includes(granted))
    return res.status(400).json({ message: 'Nilai tidak valid' });
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, type: 'owner' }, { granted }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'Owner tidak ditemukan' });
  res.json(user);
};
