import { useEffect, useState } from 'react';
import api, { errMsg, getUser, rupiah } from '../../../api.js';
import Toast from '../../common/Toast.jsx';

const empty = { propertyType: 'residential', propertyAdType: 'rent', propertyAddress: '', ownerContact: '', propertyAmt: 0, additionalInfo: '' };

export default function OwnerHome() {
  const [granted, setGranted] = useState(getUser().granted === 'granted');
  const [tab, setTab] = useState('add');
  const [props, setProps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [f, setF] = useState(empty);
  const [files, setFiles] = useState([]);
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState();

  const load = async () => {
    try {
      setProps((await api.get('/owner/properties')).data);
      setBookings((await api.get('/owner/bookings')).data);
      setGranted(true);
    } catch (e) { if (e.response?.status === 403) setGranted(false); }
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => fd.append(k, v));
    [...files].forEach((file) => fd.append('propertyImage', file));
    try {
      await api.post('/owner/properties', fd);
      setMsg({ type: 'success', text: 'Properti berhasil ditambahkan.' });
      setF(empty); e.target.reset(); load();
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try { await api.put(`/owner/properties/${edit._id}`, edit); setEdit(null); load(); }
    catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };
  const del = async (id) => {
    if (window.confirm('Hapus properti ini beserta booking-nya?')) { await api.delete(`/owner/properties/${id}`); load(); }
  };
  const setStatus = async (id, bookingStatus) => { await api.put(`/owner/bookings/${id}`, { bookingStatus }); load(); };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (!granted) return (
    <div className="container py-5"><div className="panel text-center">
      <h5>Akun owner belum disetujui</h5>
      <p className="text-secondary mb-3">Admin perlu menyetujui akunmu sebelum kamu bisa mengelola properti.</p>
      <button className="btn btn-accent" onClick={load}>Cek status lagi</button></div></div>
  );

  return (
    <div className="container py-4">
      <ul className="nav nav-tabs mb-3">
        {[['add', 'Add Property'], ['all', 'All Properties'], ['book', 'All Bookings']].map(([k, l]) => (
          <li className="nav-item" key={k}><button className={`nav-link ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button></li>))}
      </ul>
      <Toast msg={msg} />

      {tab === 'add' && (
        <form className="panel" onSubmit={add}>
          <h5 className="text-primary text-center mb-3">Add New Property</h5>
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label small">Property Type</label>
              <select className="form-select" value={f.propertyType} onChange={set('propertyType')}><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="land/plot">Land / Plot</option></select></div>
            <div className="col-md-4"><label className="form-label small">Property Ad Type</label>
              <select className="form-select" value={f.propertyAdType} onChange={set('propertyAdType')}><option value="rent">Rent</option><option value="sale">Sale</option></select></div>
            <div className="col-md-4"><label className="form-label small">Alamat lengkap</label>
              <input className="form-control" required value={f.propertyAddress} onChange={set('propertyAddress')} /></div>
            <div className="col-md-4"><label className="form-label small">Foto properti (maks. 5)</label>
              <input className="form-control" type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} /></div>
            <div className="col-md-4"><label className="form-label small">Kontak owner</label>
              <input className="form-control" required value={f.ownerContact} onChange={set('ownerContact')} /></div>
            <div className="col-md-4"><label className="form-label small">Harga ($)</label>
              <input className="form-control" type="number" min="0" value={f.propertyAmt} onChange={set('propertyAmt')} /></div>
            <div className="col-12"><label className="form-label small">Detail tambahan</label>
              <textarea className="form-control" rows="3" value={f.additionalInfo} onChange={set('additionalInfo')} /></div>
          </div>
          <div className="text-end mt-3"><button className="btn btn-accent">Simpan properti</button></div>
        </form>
      )}

      {tab === 'all' && (
        <div className="panel table-responsive">
          {edit && (
            <form className="border rounded p-3 mb-3" onSubmit={saveEdit}>
              <div className="row g-2">
                <div className="col-md-4"><input className="form-control" value={edit.propertyAddress} onChange={(e) => setEdit({ ...edit, propertyAddress: e.target.value })} /></div>
                <div className="col-md-2"><input className="form-control" type="number" value={edit.propertyAmt} onChange={(e) => setEdit({ ...edit, propertyAmt: e.target.value })} /></div>
                <div className="col-md-2"><input className="form-control" value={edit.ownerContact} onChange={(e) => setEdit({ ...edit, ownerContact: e.target.value })} /></div>
                <div className="col-md-2"><select className="form-select" value={edit.isAvailable} onChange={(e) => setEdit({ ...edit, isAvailable: e.target.value })}><option>Available</option><option>Unavailable</option></select></div>
                <div className="col-md-2 d-flex gap-2"><button className="btn btn-accent flex-grow-1">Simpan</button><button type="button" className="btn btn-outline-secondary" onClick={() => setEdit(null)}>Batal</button></div>
              </div>
            </form>
          )}
          <table className="table table-sm align-middle">
            <thead><tr><th>Property ID</th><th>Type</th><th>Ad</th><th>Alamat</th><th>Kontak</th><th>Harga</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {props.map((p) => (
                <tr key={p._id}><td className="id-cell">{p._id}</td><td>{p.propertyType}</td><td>{p.propertyAdType}</td><td>{p.propertyAddress}</td><td>{p.ownerContact}</td><td>{rupiah(p.propertyAmt)}</td>
                  <td className={p.isAvailable === 'Available' ? 'text-success' : 'text-danger'}>{p.isAvailable}</td>
                  <td className="text-nowrap"><button className="btn btn-outline-primary btn-sm me-1" onClick={() => setEdit(p)}>Edit</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => del(p._id)}>Delete</button></td></tr>))}
              {!props.length && <tr><td colSpan="8" className="text-center text-secondary">Belum ada properti. Buka tab “Add Property” untuk menambahkan.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'book' && (
        <div className="panel table-responsive">
          <table className="table table-sm align-middle">
            <thead><tr><th>Booking ID</th><th>Property ID</th><th>Tenant</th><th>Telepon</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}><td className="id-cell">{b._id}</td><td className="id-cell">{b.propertyId}</td><td>{b.userName}</td><td>{b.phone}</td>
                  <td className={b.bookingStatus === 'booked' ? 'text-success' : 'text-warning'}>{b.bookingStatus}</td>
                  <td>{b.bookingStatus === 'pending'
                    ? <button className="btn btn-success btn-sm" onClick={() => setStatus(b._id, 'booked')}>Mark Booked</button>
                    : <button className="btn btn-warning btn-sm" onClick={() => setStatus(b._id, 'pending')}>Mark Pending</button>}</td></tr>))}
              {!bookings.length && <tr><td colSpan="6" className="text-center text-secondary">Belum ada booking masuk.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
