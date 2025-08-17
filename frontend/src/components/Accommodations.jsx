import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import AccommodationList from "../components/AccommodationList";
import Notification from "../components/Notification";
import SearchForm from "../components/SearchForm";
import Offers from "../components/Offers";

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get("/accommodations");
        setAccommodations(response.data);
      } catch (err) {
        setError("Не вдалося завантажити помешкання.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  const handleSearch = ({ destination, checkInDate, checkOutDate, guests }) => {
    const filtered = accommodations.filter((acc) => 
        acc.location.toLowerCase().includes(destination.toLowerCase())
    );
    setSearchQuery(destination);
    setAccommodations(filtered);
  };

  return (
    <div>
      {/* Hero-секція */}
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-heading">Знайдіть помешкання для наступної подорожі</h1>
          <p className="hero-subheading">Знахoдьте пропозиції готелів, приватних помешкань та багато іншого...</p>
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      <div className="container mt-4">
        <Offers />
        {loading && <p className="text-center">Завантаження...</p>}
        {error && <Notification message={error} type="error" />}
        {!loading && !error && (
          <AccommodationList accommodations={accommodations} />
        )}
      </div>
    </div>
  );
};

export default Accommodations;
