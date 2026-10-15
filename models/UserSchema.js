const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
  name: { type: String, required: [true, 'Nama wajib diisi'] },
  email: { type: String, required: [true, 'Email wajib diisi'], unique: true, lowercase: true },
  password: { type: String, required: [true, 'Password wajib diisi'] },
  type: { type: String, enum: ['renter', 'owner', 'admin'], required: [true, 'Tipe user wajib diisi'] },
  granted: { type: String, enum: ['granted', 'ungranted'], default: 'ungranted' }, // khusus owner
}, { timestamps: true });

module.exports = mongoose.model('user', userModel);
