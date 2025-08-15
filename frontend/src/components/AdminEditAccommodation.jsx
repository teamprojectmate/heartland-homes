import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/v1";

const AdminEditAccommodation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  // ✅ Виправлення: Стан форми відповідає структурі DTO
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
    // ✅ Виправлення: Перевірка на роль 'MANAGER'
    if (!user || user.role !== "MANAGER") {
      navigate("/");
      return;
    }

    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/accommodations/${id}`);
        const data = response.data;
        // ✅ Виправлення: Заповнюємо форму даними з правильними іменами полів
        setFormData({
          type: data.type,
          location: data.location,
          size: data.size,
          amenities: data.amenities.join(", "), // Перетворюємо масив в рядок
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

    // ✅ Виправлення: Перетворюємо рядок amenities в масив
    const amenitiesArray = amenities.split(",").map((item) => item.trim());

    try {
      const token = user.token;
      // ✅ Виправлення: Надсилаємо правильні дані для оновлення
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
    return <p className="text-xs-center mt-5">Завантаження...</p>;
  }

  if (error) {
    return <p className="text-xs-center text-danger mt-5">Помилка: {error}</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-xs-center">Редагувати помешкання</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* ✅ Використовуємо правильні поля форми */}
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

            <div className="d-flex justify-content-between mt-3">
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
