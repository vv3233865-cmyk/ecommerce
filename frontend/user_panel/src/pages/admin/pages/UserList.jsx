import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AdminUserPage.css';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:4000/api/all-users', {
        headers: { token }
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err.message);
      alert('Failed to load users');
    }
  };

  return (
    <div className="admin-user-page">
      <h1 className="title">Users Management</h1>
      <div className="user-table-container fade-in">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="slide-up">
                  <td>{index + 1}</td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contact}</td>
                  <td className={`role ${user.role}`}>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
