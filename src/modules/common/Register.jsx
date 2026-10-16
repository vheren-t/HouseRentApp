import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../../api.js';
import Toast from './Toast.jsx';

export default function Register() {
  const [f, setF] = useState({ name: '', email: '', password: '', type: '' });
  const [msg, setMsg] = useState();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/register', f);
      setMsg({ type: 'success', text: f.type === 'owner'
        ? 'Registrasi berhasil. Tunggu persetujuan admin sebelum menambah properti.'
        : 'Registrasi berhasil. Mengalihkan ke halaman login…' });
      setTimeout(() => nav('/login'), 1500);
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <form className="panel auth-card" onSubmit={submit}>
      <h4 className="text-center mb-3">Sign Up</h4>
      <Toast msg={msg} />
      <input className="form-control mb-2" placeholder="Nama lengkap" required value={f.name} onChange={set('name')} />
      <input className="form-control mb-2" type="email" placeholder="Email" required value={f.email} onChange={set('email')} />
      <input className="form-control mb-2" type="password" placeholder="Password" required minLength={6} value={f.password} onChange={set('password')} />
      <select className="form-select mb-3" required value={f.type} onChange={set('type')}>
        <option value="">Pilih tipe user</option>
        <option value="renter">Renter</option>
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
      </select>
      <button className="btn btn-accent w-100">Sign Up</button>
      <p className="text-center mt-3 mb-0 small">Sudah punya akun? <Link to="/login">Sign in</Link></p>
    </form>
  );
}
