import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import ImageGallery from "react-image-gallery";
import BookingForm from "../components/BookingForm";
import LocationMap from "../components/LocationMap";

const AccommodationDetails = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`/accommodations/${id}`);
        setAccommodation(response.data);
      } catch (err) {
        setError("Не вдалося завантажити деталі помешкання.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Завантаження...</p>;
  if (error) return <p className="alert-info mt-5 text-center">{error}</p>;
  if (!accommodation) return <p className="text-center mt-5">Помешкання не знайдено.</p>;

  const images = [
    {
      original: accommodation.mainPhotoUrl,
      thumbnail: accommodation.mainPhotoUrl,
      originalAlt: accommodation.location,
    },
  ];

  return (
    <div className="container mt-4"> // ✅ Змінено
      <div className="row"> // ✅ Змінено
        <div className="col-md-8"> // ✅ Змінено
          <div className="accommodation-details-container mb-4">
            <ImageGallery items={images} showPlayButton={false} />
            <h1 className="details-heading mt-4">{accommodation.location}</h1>
            <p className="details-subheading">{accommodation.description}</p>
            <hr />
            <h4>Деталі</h4>
            <ul className="details-list">
              <li>**Розмір:** {accommodation.size}</li>
              <li>**Ціна:** {accommodation.dailyRate}$ на добу</li>
              <li>**Опис:** {accommodation.description}</li>
            </ul>
          </div>

          <div className="mt-5">
            <h4 className="mt-5">Розташування на карті</h4>
            <LocationMap
              location={accommodation.location}
              latitude={accommodation.latitude}
              longitude={accommodation.longitude}
            />
          </div>
        </div>
        <div className="col-md-4"> // ✅ Змінено
          <div className="booking-card">
            <div>
              <h5 className="booking-title">Забронювати</h5>
              <p>Ціна: **{accommodation.dailyRate}$** на добу</p>
              <BookingForm accommodationId={accommodation.id} dailyRate={accommodation.dailyRate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetails;
