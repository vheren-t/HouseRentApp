import { useEffect, useState } from 'react';
import api, { rupiah } from '../../api.js';

export default function AdminHome() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [props, setProps] = useState([]);
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    setUsers((await api.get('/admin/users')).data);
    setProps((await api.get('/admin/properties')).data);
    setBookings((await api.get('/admin/bookings')).data);
  };
  useEffect(() => { load(); }, []);

  const grant = async (id, granted) => { await api.put(`/admin/users/${id}/grant`, { granted }); load(); };

  return (
    <div className="container py-4">
      <ul className="nav nav-tabs mb-3">
        {[['users', 'All Users'], ['props', 'All Properties'], ['book', 'All Bookings']].map(([k, l]) => (
          <li className="nav-item" key={k}><button className={`nav-link ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button></li>))}
      </ul>
      <div className="panel table-responsive">
        {tab === 'users' && (
          <table className="table table-sm align-middle">
            <thead><tr><th>User ID</th><th>Nama</th><th>Email</th><th>Tipe</th><th>Granted (owner)</th><th></th></tr></thead>
            <tbody>{users.map((u) => (
              <tr key={u._id}><td className="id-cell">{u._id}</td><td>{u.name}</td><td>{u.email}</td><td className="text-primary">{u.type}</td>
                <td className={u.granted === 'granted' ? 'text-success' : 'text-warning'}>{u.type === 'owner' ? u.granted : ''}</td>
                <td>{u.type === 'owner' && (u.granted === 'granted'
                  ? <button className="btn btn-danger btn-sm" onClick={() => grant(u._id, 'ungranted')}>Ungrant</button>
                  : <button className="btn btn-success btn-sm" onClick={() => grant(u._id, 'granted')}>Grant</button>)}</td></tr>))}</tbody>
          </table>)}
        {tab === 'props' && (
          <table className="table table-sm align-middle">
            <thead><tr><th>Property ID</th><th>Owner ID</th><th>Type</th><th>Ad</th><th>Alamat</th><th>Kontak</th><th>Harga</th></tr></thead>
            <tbody>{props.map((p) => (
              <tr key={p._id}><td className="id-cell">{p._id}</td><td className="id-cell">{p.ownerId}</td><td>{p.propertyType}</td><td>{p.propertyAdType}</td><td>{p.propertyAddress}</td><td>{p.ownerContact}</td><td>{rupiah(p.propertyAmt)}</td></tr>))}
              {!props.length && <tr><td colSpan="7" className="text-center text-secondary">Belum ada properti.</td></tr>}</tbody>
          </table>)}
        {tab === 'book' && (
          <table className="table table-sm align-middle">
            <thead><tr><th>Booking ID</th><th>Owner ID</th><th>Property ID</th><th>Tenant ID</th><th>Tenant</th><th>Status</th></tr></thead>
            <tbody>{bookings.map((b) => (
              <tr key={b._id}><td className="id-cell">{b._id}</td><td className="id-cell">{b.ownerID}</td><td className="id-cell">{b.propertyId}</td><td className="id-cell">{b.userID}</td><td>{b.userName}</td>
                <td className={b.bookingStatus === 'booked' ? 'text-success' : 'text-warning'}>{b.bookingStatus}</td></tr>))}
              {!bookings.length && <tr><td colSpan="6" className="text-center text-secondary">Belum ada booking.</td></tr>}</tbody>
          </table>)}
      </div>
    </div>
  );
}
