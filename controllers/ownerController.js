const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');
const User = require('../models/UserSchema');

exports.addProperty = async (req, res) => {
  try {
    const owner = await User.findById(req.user.id);
    const images = (req.files || []).map((f) => f.filename);
    const property = await Property.create({
      ...req.body, ownerId: owner._id, ownerName: owner.name, propertyImage: images,
    });
    res.status(201).json(property);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.myProperties = async (req, res) => {
  res.json(await Property.find({ ownerId: req.user.id }).sort({ createdAt: -1 }));
};

exports.updateProperty = async (req, res) => {
  const { propertyAddress, propertyAmt, ownerContact, additionalInfo, isAvailable, propertyType, propertyAdType } = req.body;
  const property = await Property.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.id },
    { propertyAddress, propertyAmt, ownerContact, additionalInfo, isAvailable, propertyType, propertyAdType },
    { new: true, omitUndefined: true, runValidators: true }
  );
  if (!property) return res.status(404).json({ message: 'Properti tidak ditemukan' });
  res.json(property);
};

exports.deleteProperty = async (req, res) => {
  const property = await Property.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
  if (!property) return res.status(404).json({ message: 'Properti tidak ditemukan' });
  await Booking.deleteMany({ propertyId: property._id });
  res.json({ message: 'Properti dihapus' });
};

exports.ownerBookings = async (req, res) => {
  res.json(await Booking.find({ ownerID: req.user.id }).sort({ createdAt: -1 }));
};

exports.updateBookingStatus = async (req, res) => {
  const { bookingStatus } = req.body;
  if (!['pending', 'booked'].includes(bookingStatus))
    return res.status(400).json({ message: 'Status tidak valid' });
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, ownerID: req.user.id }, { bookingStatus }, { new: true });
  if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });
  // Properti otomatis tidak tersedia saat booking dikonfirmasi
  await Property.findByIdAndUpdate(booking.propertyId, {
    isAvailable: bookingStatus === 'booked' ? 'Unavailable' : 'Available' });
  res.json(booking);
};
