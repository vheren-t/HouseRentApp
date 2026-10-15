const mongoose = require('mongoose');

const bookingModel = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'property', required: true },
  ownerID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  userName: { type: String, required: [true, 'Nama wajib diisi'] },
  phone: { type: String, required: [true, 'Nomor telepon wajib diisi'] },
  bookingStatus: { type: String, enum: ['pending', 'booked'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('booking', bookingModel);
