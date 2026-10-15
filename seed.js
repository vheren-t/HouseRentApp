// Mengisi data contoh: npm run seed   (aman dijalankan berulang)
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/connect');
const User = require('./models/UserSchema');
const Property = require('./models/PropertySchema');

const U = (id) => `https://images.unsplash.com/${id}?w=900`;
const P = (propertyType, propertyAdType, propertyAddress, propertyAmt, ownerContact, img, additionalInfo, isAvailable = 'Available') =>
  ({ propertyType, propertyAdType, propertyAddress, propertyAmt, ownerContact, propertyImage: [U(img)], additionalInfo, isAvailable });

(async () => {
  await connectDB();
  const mk = async (name, email, pw, type, granted) =>
    (await User.findOne({ email })) || User.create({ name, email, type, granted, password: await bcrypt.hash(pw, 10) });
  const owner = await mk('Pravanshu', 'pravanshu@gmail.com', 'owner123', 'owner', 'granted');
  await mk('Ram', 'ram@gmail.com', 'renter123', 'renter');

  if (await Property.countDocuments({ ownerId: owner._id })) {
    console.log('Data contoh sudah ada, dilewati.'); return process.exit(0);
  }
  const items = [
    P('residential', 'rent', '17, 4th Cross, Indiranagar 2nd Stage, Bengaluru, Karnataka - 560038', 35000, '+91 98765 43210', 'photo-1568605114967-8130f3a36994', '3BHK furnished, gated community, parkir mobil.'),
    P('commercial', 'sale', '102, Hosur Road, Near Forum Mall, Koramangala, Bengaluru - 560095', 18000000, '+91 90123 45678', 'photo-1486406146926-c627a92ad1ab', 'Ruang komersial 2.400 sqft di lokasi strategis.', 'Unavailable'),
    P('residential', 'rent', '235, 6th Main, JP Nagar Phase 7, Bengaluru, Karnataka - 560078', 45000, '+91 99876 54321', 'photo-1564013799919-ab600027ffc6', '4BHK dengan balkon dan taman kecil.'),
    P('commercial', 'rent', '56, 2nd Floor, Brigade Road, MG Road, Bengaluru - 560001', 120000, '+91 91234 56789', 'photo-1497366216548-37526070297c', 'Kantor siap pakai, lift, dan genset.'),
    P('land/plot', 'sale', '17, 4th Cross, Indiranagar 2nd Stage, Bengaluru, Karnataka - 560038', 9500000, '+91 98765 43210', 'photo-1500382017468-9049fed747ef', 'Tanah 1.200 sqft, sertifikat bersih.'),
    P('residential', 'rent', 'Electronic City Phase 1, Bengaluru, Karnataka - 560100', 14000, '+91 98450 11223', 'photo-1522708323590-d24dbb6b0267', '1BHK furnished, gated, dekat kantor IT.'),
    P('residential', 'rent', 'Electronic City Phase 2, Bengaluru, Karnataka - 560100', 17500, '+91 98450 33445', 'photo-1502672260266-1c1ef2d93688', '2BHK semi-furnished, gated, 24 jam keamanan.'),
  ].map((x) => ({ ...x, ownerId: owner._id, ownerName: owner.name }));
  await Property.insertMany(items);
  console.log(`${items.length} properti contoh ditambahkan.`);
  process.exit(0);
})();
