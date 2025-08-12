import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkToken } from '../utils/checkToken';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const isValid = await checkToken();
      if (!isValid) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    };

    verify();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li onClick={() => navigate('/admin/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/admin/menu')}>Manage Menu</li>
          <li onClick={() => navigate('/admin/reservations')}>Reservations</li>
          <li onClick={() => navigate('/admin/messages')}>Contact Messages</li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-content">
        <h2>Welcome, Admin 👋</h2>
        <p>This is your dashboard. Choose an action from the left.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
