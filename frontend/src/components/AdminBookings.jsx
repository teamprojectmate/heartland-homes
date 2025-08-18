import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import "../styles/components/_admin.scss";

const AdminBookings = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "MANAGER") {
      navigate("/");
      return;
    }

    const fetchAllBookings = async () => {
      try {
        const token = user.token;
        const response = await axios.get("/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, [user, navigate]);

  const handleCancelBooking = async (id) => {
    try {
      const token = user.token;
      await axios.delete(`/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(bookings.filter((booking) => booking.id !== id));
      setConfirmCancelId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Помилка скасування бронювання");
    }
  };

  if (loading) {
    return (
      <div className="container admin-page-container text-center"> {/* ✅ Змінено app-container на container */}
        <h1 className="section-heading">Усі бронювання (Адмін-панель)</h1>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="container admin-page-container"> {/* ✅ Змінено app-container на container */}
      <h1 className="section-heading text-center">Усі бронювання (Адмін-панель)</h1>
      {error && <Notification message={error} type="danger" />}

      {bookings.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Помешкання</th>
              <th>Користувач</th>
              <th>Дати</th>
              <th>Сума</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.accommodationName}</td>
                <td>{booking.userName}</td>
                <td>
                  {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </td>
                <td>{booking.totalAmount}$</td>
                <td>
                  <button
                    onClick={() => setConfirmCancelId(booking.id)}
                    className="btn-danger btn-sm btn-action"
                  >
                    Скасувати
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert-info text-center">
          Бронювань ще немає.
        </div>
      )}

      {confirmCancelId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Підтвердження скасування</h5>
            </div>
            <div className="modal-body">
              <p>Ви впевнені, що хочете скасувати це бронювання?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmCancelId(null)}
              >
                Ні, повернутися
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => handleCancelBooking(confirmCancelId)}
              >
                Так, скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
