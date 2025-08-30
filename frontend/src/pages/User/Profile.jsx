import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../store/slices/userSlice';
import Notification from '../../components/Notification';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '' });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || ''
      });
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  return (
    <div className="container page">
      <div className="profile-card">
        <h1 className="auth-title">Мій профіль</h1>

        {/* ✅ Тепер використовуємо тільки error зі слайсу */}
        {error && <Notification message={error} type="danger" />}

        {loading && <p>Завантаження...</p>}

        {!loading && profile && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Електронна пошта</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Ім’я</label>
              <input
                type="text"
                className="form-control"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Прізвище</label>
              <input
                type="text"
                className="form-control"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Збереження...' : 'Редагувати профіль'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
