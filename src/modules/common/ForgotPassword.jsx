import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api.js';
import Toast from './Toast.jsx';

export default function ForgotPassword() {
  const [f, setF] = useState({ email: '', newPassword: '' });
  const [msg, setMsg] = useState();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/user/forgot-password', f);
      setMsg({ type: 'success', text: data.message });
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <form className="panel auth-card" onSubmit={submit}>
      <h4 className="text-center mb-3">Reset Password</h4>
      <Toast msg={msg} />
      <input className="form-control mb-2" type="email" placeholder="Email terdaftar" required
        value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input className="form-control mb-3" type="password" placeholder="Password baru (min. 6 karakter)" required minLength={6}
        value={f.newPassword} onChange={(e) => setF({ ...f, newPassword: e.target.value })} />
      <button className="btn btn-accent w-100">Reset Password</button>
      <p className="text-center mt-3 mb-0 small"><Link to="/login">Kembali ke login</Link></p>
    </form>
  );
}
