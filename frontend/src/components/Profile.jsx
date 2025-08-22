// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../api/axios';
import Notification from '../components/Notification';
import { updateUser } from '../store/slices/authSlice';
import '../styles/components/_profile.scss';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Хендлер зміни фото
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Показуємо превʼю одразу
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const response = await axios.put('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // ✅ Оновлюємо юзера в Redux
      dispatch(updateUser(response.data));
      setNotification({ message: 'Фото профілю оновлено!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Не вдалося змінити фото.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Оновлення профілю
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put('/users/me', {
        email,
        firstName,
        lastName
      });
      dispatch(updateUser(response.data));
      setNotification({ message: 'Профіль оновлено!', type: 'success' });
    } catch {
      setNotification({ message: 'Помилка при оновленні профілю.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="profile-card">
        <h1 className="auth-title">Профіль</h1>

        {/* Фото профілю */}
        <div className="profile-avatar">
          <img
            src={
              avatarPreview ||
              'https://images.unsplash.com/photo-1552416983-cb38e72623b2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDQzfHwlRDAlQjAlRDAlQjIlRDAlQjAlRDElODIlRDAlQjAlRDElODB8ZW58MHx8MHx8fDA%3D'
            }
            alt="Avatar"
            className="profile-photo"
          />
          <label htmlFor="avatarUpload" className="btn-secondary mt-2">
            {loading ? 'Завантаження...' : 'Змінити фото'}
          </label>
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>

        {/* Форма профілю */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Електронна пошта</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Ім'я</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Прізвище</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Збереження...' : 'Редагувати профіль'}
          </button>
        </form>
      </div>

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
};

export default Profile;
