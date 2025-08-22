import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import Notification from './Notification';
import '../styles/layout/_main-layout.scss';
import '../styles/components/_forms.scss';
import '../styles/components/_buttons.scss';
import '../styles/components/_cards.scss';
import '../styles/components/_profile.scss';

const TelegramNotifications = () => {
  const { token } = useSelector((state) => state.auth);
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get('/users/me');
        if (data?.telegramChatId) {
          setTelegramChatId(data.telegramChatId);
        }
      } catch {
        setNotification({
          message: 'Не вдалося завантажити дані профілю.',
          type: 'danger'
        });
      }
    };

    if (token) fetchUserProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!telegramChatId.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.put('/users/me', { telegramChatId });
      setNotification({
        message: 'Налаштування Telegram успішно оновлено!',
        type: 'success'
      });
    } catch {
      setNotification({
        message: 'Не вдалося оновити налаштування.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 profile-card">
          <h1 className="auth-title">Налаштування Telegram-сповіщень</h1>
          <p>
            Щоб отримувати сповіщення, будь ласка, вкажіть ваш{' '}
            <strong>Telegram Chat ID</strong>.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="telegramChatId">Ваш Telegram Chat ID</label>
              <input
                type="text"
                className="form-control"
                id="telegramChatId"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="Наприклад: 123456789"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Збереження...' : 'Зберегти'}
            </button>
          </form>
        </div>
      </div>

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </main>
  );
};

export default TelegramNotifications;
