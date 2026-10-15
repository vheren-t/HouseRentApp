const mongoose = require('mongoose');

const propertyModel = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  ownerName: String,
  propertyType: { type: String, enum: ['residential', 'commercial', 'land/plot'], required: [true, 'Tipe properti wajib diisi'] },
  propertyAdType: { type: String, enum: ['rent', 'sale'], required: [true, 'Tipe iklan wajib diisi'] },
  propertyAddress: { type: String, required: [true, 'Alamat wajib diisi'] },
  ownerContact: { type: String, required: [true, 'Kontak owner wajib diisi'] },
  propertyAmt: { type: Number, default: 0 },
  propertyImage: [String],
  additionalInfo: String,
  isAvailable: { type: String, enum: ['Available', 'Unavailable'], default: 'Available' },
}, { timestamps: true });

module.exports = mongoose.model('property', propertyModel);
