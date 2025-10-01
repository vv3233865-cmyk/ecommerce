import React from 'react';
import './AdminHeader.css';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1>Dream Cart</h1>
      </div>
      <div className="admin-header-right">
        {user && <span className="admin-username">Welcome, {user.name}</span>}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;
