import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import '../components/adminlayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true); // true = still checking

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    console.log("USER FROM STORAGE:", userStr);
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.role === 'admin') {
          console.log("✅ Admin verified");
          setChecking(false);
        } else {
          console.log(`❌ Not admin (role=${userObj?.role}) → redirecting`);
          navigate('/', { replace: true });
        }
      } catch {
        console.log("❌ Failed to parse user → redirecting to login");
        navigate('/login', { replace: true });
      }
    } else {
      console.log("❌ No user → redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (checking) {
    return <div>Loading admin panel...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
