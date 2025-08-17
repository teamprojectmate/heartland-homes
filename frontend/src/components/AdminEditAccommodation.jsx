import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Notification from "./Notification";

const BASE_URL = "http://localhost:8080";

const AdminEditAccommodation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    type: "APARTMENT",
    location: "",
    size: "",
    amenities: "",
    dailyRate: "",
    availability: "",
    picture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "MANAGER") {
      navigate("/");
      return;
    }

    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/accommodations/${id}`);
        const data = response.data;
        setFormData({
          type: data.type,
          location: data.location,
          size: data.size,
          amenities: data.amenities.join(", "),
          dailyRate: data.dailyRate,
          availability: data.availability,
          picture: data.picture || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [user, navigate, id]);

  const {
    type,
    location,
    size,
    amenities,
    dailyRate,
    availability,
    picture,
  } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const amenitiesArray = amenities.split(",").map((item) => item.trim());

    try {
      const token = user.token;
      await axios.put(
        `${BASE_URL}/accommodations/${id}`,
        {
          type,
          location,
          size,
          amenities: amenitiesArray,
          dailyRate,
          availability,
          picture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLoading(false);
      navigate("/admin/accommodations");
    } catch (err) {
      setError(err.response?.data?.message || "Помилка оновлення помешкання");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = user.token;
      await axios.delete(`${BASE_URL}/accommodations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      navigate("/admin/accommodations");
    } catch (err) {
      setError(err.response?.data?.message || "Помилка видалення помешкання");
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Завантаження...</p>;
  }

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12 auth-form-container">
          <h2 className="auth-title">Редагувати помешкання</h2>
          {error && <Notification message={error} type="error" />}
          <form onSubmit={handleSubmit}>
            <fieldset className="form-group">
              <label>Тип житла</label>
              <select
                className="form-control form-control-lg"
                name="type"
                value={type}
                onChange={onChange}
                required
              >
                <option value="HOUSE">HOUSE</option>
                <option value="APARTMENT">APARTMENT</option>
                <option value="CONDO">CONDO</option>
                <option value="VACATION_HOME">VACATION_HOME</option>
              </select>
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Місцезнаходження"
                name="location"
                value={location}
                onChange={onChange}
                required
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Розмір (напр. '50 м²')"
                name="size"
                value={size}
                onChange={onChange}
                required
              />
            </fieldset>
            <fieldset className="form-group">
              <textarea
                className="form-control form-control-lg"
                rows="3"
                placeholder="Зручності (перерахуйте через кому: Wi-Fi, Парковка,...)"
                name="amenities"
                value={amenities}
                onChange={onChange}
                required
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="number"
                placeholder="Ціна за добу"
                name="dailyRate"
                value={dailyRate}
                onChange={onChange}
                required
                min="0"
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="number"
                placeholder="Доступна кількість"
                name="availability"
                value={availability}
                onChange={onChange}
                required
                min="0"
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="URL зображення"
                name="picture"
                value={picture}
                onChange={onChange}
              />
            </fieldset>

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-lg btn-danger"
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
              >
                Видалити
              </button>
              <button
                className="btn btn-lg btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Завантаження..." : "Оновити"}
              </button>
            </div>
          </form>

          {confirmDelete && (
            <div className="modal d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
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
                      className="btn btn-secondary"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Скасувати
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDelete}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditAccommodation;
