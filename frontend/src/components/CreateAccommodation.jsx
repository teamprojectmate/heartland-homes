import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import "../styles/components/_forms.scss";
import "../styles/components/_admin.scss";

const CreateAccommodation = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    type: "APARTMENT",
    location: "",
    city: "",
    size: "",
    amenities: "",
    dailyRate: "",
    availability: "",
    mainPhotoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "MANAGER") {
      navigate("/");
    }
  }, [user, navigate]);

  const { type, location, city, size, amenities, dailyRate, availability, mainPhotoUrl } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const amenitiesArray = amenities.split(",").map((item) => item.trim());

    try {
      const token = user.token;
      await axios.post(
        "/accommodations",
        {
          type,
          location,
          city,
          size,
          amenities: amenitiesArray,
          dailyRate,
          availability,
          mainPhotoUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      navigate("/admin/accommodations");
    } catch (err) {
      setError(err.response?.data?.message || "Помилка створення помешкання");
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 auth-form-container">
          <h2 className="auth-title">Створити нове помешкання</h2>
          {error && <Notification message={error} type="danger" />}
          <form onSubmit={handleSubmit}>
            <fieldset className="form-group">
              <label>Тип житла</label>
              <select
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                type="text"
                placeholder="Місто"
                name="city"
                value={city}
                onChange={onChange}
                required
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                type="text"
                placeholder="URL зображення"
                name="mainPhotoUrl"
                value={mainPhotoUrl}
                onChange={onChange}
              />
            </fieldset>

            <button
              className="btn-primary btn-full-width"
              type="submit"
              disabled={loading}
            >
              {loading ? "Завантаження..." : "Створити"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAccommodation;
