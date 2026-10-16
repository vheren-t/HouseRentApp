import { useEffect, useState } from 'react';
import api, { errMsg, getUser } from '../../../api.js';
import PropertyCards from '../AllPropertiesCards.jsx';
import Toast from '../../common/Toast.jsx';
import moment from 'moment';

export default function RenterHome() {
  const user = getUser();
  const [tab, setTab] = useState('props');
  const [list, setList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [target, setTarget] = useState(null);
  const [form, setForm] = useState({ userName: user.name, phone: '' });
  const [msg, setMsg] = useState();

  const load = async () => {
    setList((await api.get('/user/properties')).data);
    setBookings((await api.get('/user/bookings')).data);
  };
  useEffect(() => { load(); }, []);

  const book = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/book', { propertyId: target._id, ...form });
      setMsg({ type: 'success', text: 'Permintaan booking terkirim. Status: pending sampai disetujui owner.' });
      setTarget(null); load();
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <div className="container py-4">
      <ul className="nav nav-tabs mb-3">
        {[['props', 'All Properties'], ['hist', 'Booking History']].map(([k, l]) => (
          <li className="nav-item" key={k}><button className={`nav-link ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button></li>))}
      </ul>
      <Toast msg={msg} />
      {tab === 'props' && (
        <div className="panel">
          {target && (
            <form className="border rounded p-3 mb-3" onSubmit={book}>
              <h6>Booking: {target.propertyAddress}</h6>
              <div className="small text-secondary mb-2">Owner: {target.ownerName} · {target.ownerContact}</div>
              <div className="row g-2">
                <div className="col-md-5"><input className="form-control" placeholder="Nama" required value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} /></div>
                <div className="col-md-4"><input className="form-control" placeholder="Nomor telepon" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="col-md-3 d-flex gap-2"><button className="btn btn-accent flex-grow-1">Kirim</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setTarget(null)}>Batal</button></div>
              </div>
            </form>
          )}
          <PropertyCards list={list} onBook={(p) => { setTarget(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      )}
      {tab === 'hist' && (
        <div className="panel table-responsive">
          <h6 className="text-primary">All My Bookings</h6>
          <table className="table table-sm align-middle">
            <thead><tr><th>Booking ID</th><th>Property ID</th><th>Nama</th><th>Telepon</th><th>Tanggal</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}><td className="id-cell">{b._id}</td><td className="id-cell">{b.propertyId}</td><td>{b.userName}</td><td>{b.phone}</td>
                  <td>{moment(b.createdAt).format('DD MMM YYYY')}</td>
                  <td className={b.bookingStatus === 'booked' ? 'text-success' : 'text-warning'}>{b.bookingStatus}</td></tr>))}
              {!bookings.length && <tr><td colSpan="6" className="text-center text-secondary">Belum ada booking. Pilih properti lalu klik “Get Info / Book”.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
