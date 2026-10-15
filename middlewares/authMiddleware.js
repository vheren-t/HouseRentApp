const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

// auth('owner') -> hanya owner; auth() -> semua user yang login
exports.auth = (...roles) => (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (roles.length && !roles.includes(decoded.type))
      return res.status(403).json({ message: 'Akses ditolak' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
  }
};

// Owner hanya boleh mengelola properti setelah disetujui admin
exports.ownerGranted = async (req, res, next) => {
  const owner = await User.findById(req.user.id);
  if (!owner || owner.granted !== 'granted')
    return res.status(403).json({ message: 'Akun owner belum disetujui admin' });
  next();
};
