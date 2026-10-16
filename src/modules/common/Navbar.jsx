import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../../api.js';

export default function Navbar() {
  const user = getUser();
  const nav = useNavigate();
  const logout = () => { localStorage.clear(); nav('/login'); };

  return (
    <nav className="navbar px-4 py-3" style={{ background: 'rgba(5,6,12,.7)' }}>
      <Link to="/" className="brand fs-4">RentEase</Link>
      <div className="d-flex align-items-center gap-3">
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button className="btn btn-danger btn-sm" onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/" className="text-light text-decoration-none">Home</Link>
            <Link to="/login" className="text-light text-decoration-none">Login</Link>
            <Link to="/register" className="btn btn-accent btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
