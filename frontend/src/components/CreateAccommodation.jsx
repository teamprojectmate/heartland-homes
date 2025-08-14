import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/v1";

const CreateAccommodation = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // ✅ Виправлення: Поля форми відповідають CreateAccommodationRequestDto
  const [formData, setFormData] = useState({
    type: "APARTMENT", // Приклад, можна зробити селект
    location: "",
    size: "",
    amenities: "", // Будемо вводити як рядок, розділений комами
    dailyRate: "",
    availability: "",
    picture: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Виправлення: Перевірка на роль 'MANAGER'
    if (!user || user.role !== "MANAGER") {
      navigate("/");
    }
  }, [user, navigate]);

  const { type, location, size, amenities, dailyRate, availability, picture } =
    formData;

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

    // ✅ Виправлення: Перетворення рядка amenities в масив
    const amenitiesArray = amenities.split(",").map((item) => item.trim());

    try {
      const token = user.token;
      // ✅ Виправлення: Надсилаємо правильні дані на бекенд
      await axios.post(
        `${BASE_URL}/accommodations`,
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
      setError(err.response?.data?.message || "Помилка створення помешкання");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-xs-center">Створити нове помешкання</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* ✅ Додаємо поле для типу житла */}
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
            {/* ✅ Замінюємо "Назва" на "Місцезнаходження" */}
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
            {/* ✅ Додаємо поле для розміру */}
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
            {/* ✅ Додаємо поле для зручностей */}
            <fieldset className="form-group">
              <textarea
                className="form-control form-control-lg"
                rows="3"
                placeholder="Зручності (перерахуйте через кому: Wi-Fi, Парковка,...) "
                name="amenities"
                value={amenities}
                onChange={onChange}
                required
              />
            </fieldset>
            {/* ✅ Замінюємо "Ціна за ніч" на "Ціна за добу" */}
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
            {/* ✅ Додаємо поле для доступності */}
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
            {/* ✅ Замінюємо "URL зображення" на "URL зображення" */}
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
            <button
              className="btn btn-lg btn-success pull-xs-right"
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