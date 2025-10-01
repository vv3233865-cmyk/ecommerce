import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSideBar = () => {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-sidebar-title">Admin Panel</h2>
      <nav className="admin-sidebar-nav">
        <NavLink to="/admin/dashboard" className="sidebar-link">Dashboard</NavLink>
        <NavLink to="/admin/products" className="sidebar-link">Products</NavLink>
        <NavLink to="/admin/orders" className="sidebar-link">Orders</NavLink>
        <NavLink to="/admin/users" className="sidebar-link">Users</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSideBar;
