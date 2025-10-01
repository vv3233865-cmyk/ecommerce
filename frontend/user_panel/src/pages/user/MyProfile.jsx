import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:4000/api/user/profile', {
        headers: { token }
      });
      setProfile(res.data.user);
      setFormData({
        name: res.data.user.name,
        email: res.data.user.email,
        contact: res.data.user.contact
      });
      setError('');
    } catch (err) {
      console.error('Failed to fetch profile:', err.message);
      setError('Could not load profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        'http://localhost:4000/api/user/edit',
        formData,
        { headers: { token } }
      );
      setProfile(res.data.user);
      setMessage('✅ Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Update failed:', err.message);
      setMessage('❌ Failed to update profile. Try again.');
    }
  };

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!profile) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page-bg">
      <div className="profile-container glass-effect fade-in">
        <h1 className="profile-title">My Profile</h1>

        {message && <div className="profile-message">{message}</div>}

        {editMode ? (
          <form className="profile-form slide-in" onSubmit={handleUpdate}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Contact:
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit">💾 Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)}>❌ Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-card fade-in">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Contact:</strong> {profile.contact}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
            <button className="edit-btn" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
