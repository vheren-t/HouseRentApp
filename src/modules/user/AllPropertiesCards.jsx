import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser, imgUrl, rupiah } from '../../api.js';

const TYPES = [['residential', 'Residential'], ['commercial', 'Commercial'], ['land/plot', 'Land / Plot']];
const INIT = { q: '', ad: '', type: '', avail: '', max: '' };

function Photo({ name, alt, className, onClick }) {
  const [bad, setBad] = useState(false);
  const src = imgUrl(name);
  return src && !bad
    ? <img className={className} src={src} alt={alt} onError={() => setBad(true)} onClick={onClick} />
    : <div className="prop-ph">Tanpa foto</div>;
}

function Detail({ p, onClose, onBook }) {
  const [i, setI] = useState(0);
  const user = getUser();
  const full = !!(onBook || user); // detail lengkap hanya untuk user yang login
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const available = p.isAvailable === 'Available';
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <Photo name={p.propertyImage?.[i]} alt={p.propertyAddress} className="main-img" />
        {p.propertyImage?.length > 1 && (
          <div className="d-flex gap-2 p-2">
            {p.propertyImage.map((n, k) => (
              <Photo key={n} name={n} alt="" className={`thumb ${k === i ? 'on' : ''}`} onClick={() => setI(k)} />))}
          </div>)}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <h5>{p.propertyAddress}</h5>
            <button className="btn-close" aria-label="Tutup" onClick={onClose} />
          </div>
          <div className="mb-2">
            <span className="badge text-bg-secondary me-1">{p.propertyType}</span>
            <span className="badge text-bg-primary me-1">{p.propertyAdType}</span>
            <span className={`badge ${available ? 'text-bg-success' : 'text-bg-danger'}`}>{p.isAvailable}</span>
          </div>
          {full ? (
            <>
              <h4 className="my-3">{rupiah(p.propertyAmt)}{p.propertyAdType === 'rent' && <small className="text-secondary fs-6"> / bulan</small>}</h4>
              <div className="small mb-1"><b>Owner:</b> {p.ownerName || '-'}</div>
              <div className="small mb-3"><b>Kontak:</b> {p.ownerContact}</div>
              {p.additionalInfo && <p className="text-secondary">{p.additionalInfo}</p>}
            </>
          ) : <p className="text-secondary my-3">Login untuk melihat harga, kontak owner, dan detail lengkap.</p>}
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={onClose}>Tutup</button>
            {!available ? null
              : onBook ? <button className="btn btn-accent" onClick={() => { onClose(); onBook(p); }}>Book properti ini</button>
              : !user ? <Link to="/login" className="btn btn-accent">Login untuk booking</Link>
              : user.type === 'renter' ? <Link to="/renter" className="btn btn-accent">Buka dashboard renter</Link> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// Kartu properti + filter + detail; dipakai di landing page dan dashboard renter
export default function PropertyCards({ list, onBook }) {
  const [f, setF] = useState(INIT);
  const [sel, setSel] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const shown = list.filter((p) =>
    p.propertyAddress.toLowerCase().includes(f.q.trim().toLowerCase()) &&
    (!f.ad || p.propertyAdType === f.ad) &&
    (!f.type || p.propertyType === f.type) &&
    (!f.avail || p.isAvailable === f.avail) &&
    (!f.max || p.propertyAmt <= Number(f.max)));

  return (
    <>
      <div className="row g-2 mb-2">
        <div className="col-md-4"><input className="form-control" placeholder="Cari alamat / area" value={f.q} onChange={set('q')} /></div>
        <div className="col-6 col-md-2"><select className="form-select" value={f.ad} onChange={set('ad')}>
          <option value="">Semua iklan</option><option value="rent">Rent</option><option value="sale">Sale</option></select></div>
        <div className="col-6 col-md-2"><select className="form-select" value={f.type} onChange={set('type')}>
          <option value="">Semua tipe</option>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        <div className="col-6 col-md-2"><select className="form-select" value={f.avail} onChange={set('avail')}>
          <option value="">Semua status</option><option value="Available">Tersedia</option><option value="Unavailable">Tidak tersedia</option></select></div>
        <div className="col-6 col-md-2"><input className="form-control" type="number" min="0" placeholder="Harga maks ($)" value={f.max} onChange={set('max')} /></div>
      </div>
      <div className="d-flex justify-content-between small text-secondary mb-3">
        <span>{shown.length} dari {list.length} properti</span>
        <button className="btn btn-link btn-sm p-0" onClick={() => setF(INIT)}>Reset filter</button>
      </div>

      {!shown.length && <p className="text-secondary text-center py-4">Tidak ada properti yang cocok. Ubah atau reset filter.</p>}
      <div className="row g-3">
        {shown.map((p) => (
          <div className="col-md-4" key={p._id}>
            <div className="prop-card d-flex flex-column" role="button" tabIndex={0}
              onClick={() => setSel(p)} onKeyDown={(e) => e.key === 'Enter' && setSel(p)}>
              <Photo name={p.propertyImage?.[0]} alt={p.propertyAddress} />
              <div className="p-3 d-flex flex-column flex-grow-1">
                <h6>{p.propertyAddress}</h6>
                <small className="text-secondary">{p.propertyType} - {p.propertyAdType}</small>
                {onBook && <div className="small mt-2"><b>Price:</b> {rupiah(p.propertyAmt)}</div>}
                <div className="mt-auto pt-2 small">
                  {p.isAvailable !== 'Available' ? <span className="text-danger">Not Available</span>
                    : <span className="text-warning">{onBook ? 'Klik untuk detail & booking' : 'Login to see details'}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sel && <Detail p={sel} onBook={onBook} onClose={() => setSel(null)} />}
    </>
  );
}
