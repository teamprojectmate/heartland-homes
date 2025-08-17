import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import Notification from "./Notification";

const TelegramNotifications = () => {
  const { token } = useSelector((state) => state.auth);
  
  const [telegramChatId, setTelegramChatId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/users/me");
        if (response.data.telegramChatId) {
          setTelegramChatId(response.data.telegramChatId);
        }
      } catch (error) {
        setNotification({ message: "Не вдалося завантажити дані профілю.", type: "error" });
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put("/users/me", { telegramChatId });
      setNotification({ message: "Налаштування Telegram оновлено!", type: "success" });
    } catch (error) {
      setNotification({ message: "Не вдалося оновити налаштування.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Налаштування Telegram-сповіщень</h1>
          <p className="card-text">
            Щоб отримувати сповіщення, будь ласка, надайте ваш Telegram Chat ID.
          </p>
          <form onSubmit={handleSubmit}>
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
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </button>
          </form>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </div>
  );
};

export default TelegramNotifications;
