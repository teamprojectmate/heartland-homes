import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Notification from "./Notification";
import "../styles/components/_admin.scss";

const AdminAccommodations = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "MANAGER") {
      navigate("/");
      return;
    }

    const fetchAccommodations = async () => {
      try {
        const token = user.token;
        const response = await axios.get("/accommodations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccommodations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    try {
      const token = user.token;
      await axios.delete(`/accommodations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccommodations(accommodations.filter((acc) => acc.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Помилка видалення помешкання");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Завантаження...</p>;
  }

  return (
    <div className="app-container admin-page-container"> {/* ✅ Замінено "container" */}
      <h2 className="section-heading text-center">Керування помешканнями</h2>
      <div className="text-right mb-3">
        <Link to="/admin/accommodations/new" className="btn-primary">
          Додати нове помешкання
        </Link>
      </div>

      {error && <Notification message={error} type="danger" />}

      <div className="app-row"> {/* ✅ Замінено "row" */}
        {accommodations.length > 0 ? (
          accommodations.map((accommodation) => (
            <div key={accommodation.id} className="app-col-md-4 mb-4"> {/* ✅ Замінено "col-md-4" */}
              <div className="card-custom">
                <img
                  src={accommodation.mainPhotoUrl}
                  className="card-img-top-custom"
                  alt={accommodation.location}
                />
                <div className="card-body">
                  <h5 className="card-title">{accommodation.location}</h5>
                  <p className="card-text">Тип: {accommodation.type}</p>
                  <p className="card-text">
                    Доступно: {accommodation.availability ? "Так" : "Ні"}
                  </p>
                  <Link
                    to={`/admin/accommodations/edit/${accommodation.id}`}
                    className="btn-primary"
                  >
                    Редагувати
                  </Link>
                  <button
                    onClick={() => setConfirmDeleteId(accommodation.id)}
                    className="btn-danger ml-2"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="app-col-md-12"> {/* ✅ Замінено "col-md-12" */}
            <div className="alert-info text-center">
              Помешкань ще немає.
            </div>
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Підтвердження видалення</h5>
            </div>
            <div className="modal-body">
              <p>Ви впевнені, що хочете видалити це помешкання?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                Скасувати
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccommodations;
