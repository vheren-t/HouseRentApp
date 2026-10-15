require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/connect');
const User = require('./models/UserSchema');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 8000;

connectDB().then(async () => {
  // Seed akun admin pertama bila belum ada
  if (!(await User.findOne({ type: 'admin' }))) {
    await User.create({
      name: 'Admin', email: 'admin@rentease.com',
      password: await bcrypt.hash('admin123', 10), type: 'admin',
    });
    console.log('Admin dibuat: admin@rentease.com / admin123');
  }
  app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
});
