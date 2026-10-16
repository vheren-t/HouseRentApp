import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './modules/common/Navbar.jsx';
import Home from './modules/common/Home.jsx';
import Login from './modules/common/Login.jsx';
import Register from './modules/common/Register.jsx';
import ForgotPassword from './modules/common/ForgotPassword.jsx';
import AdminHome from './modules/admin/AdminHome.jsx';
import OwnerHome from './modules/user/owner/OwnerHome.jsx';
import RenterHome from './modules/user/renter/RenterHome.jsx';
import { getUser } from './api.js';

const Guard = ({ role, children }) => {
  const user = getUser();
  return user && user.type === role ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<Guard role="admin"><AdminHome /></Guard>} />
        <Route path="/owner" element={<Guard role="owner"><OwnerHome /></Guard>} />
        <Route path="/renter" element={<Guard role="renter"><RenterHome /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
