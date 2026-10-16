import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../../api.js';
import Toast from './Toast.jsx';

export default function Login() {
  const [f, setF] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/user/login', f);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      nav(`/${data.user.type}`);
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <form className="panel auth-card" onSubmit={submit}>
      <h4 className="text-center mb-3">Sign In</h4>
      <Toast msg={msg} />
      <input className="form-control mb-2" type="email" placeholder="Email" required
        value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input className="form-control mb-3" type="password" placeholder="Password" required
        value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button className="btn btn-accent w-100">Sign In</button>
      <div className="d-flex justify-content-between mt-3 small">
        <Link to="/forgot-password" className="text-danger">Forgot Password?</Link>
        <Link to="/register">Create an Account</Link>
      </div>
    </form>
  );
}
