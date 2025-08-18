import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import AccommodationList from "../components/AccommodationList";
import Notification from "../components/Notification";
import SearchForm from "../components/SearchForm";
import Offers from "../components/Offers";
import AccommodationFilters from "../components/AccommodationFilters";

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [minDailyRate, setMinDailyRate] = useState("");
  const [maxDailyRate, setMaxDailyRate] = useState("");
  const [sortBy, setSortBy] = useState("");

  const fetchAccommodations = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/accommodations", { params });
      setAccommodations(response.data);
    } catch (err) {
      setError("Не вдалося завантажити помешкання.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations({
      cities: cities.join(","),
      types: types.join(","),
      minDailyRate,
      maxDailyRate,
      sortBy,
    });
  }, [cities, types, minDailyRate, maxDailyRate, sortBy]);

  const handleSearch = ({ destination }) => {
    if (destination) {
      setCities([destination]);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e) => {
    setCities(e.target.value.split(",").map((city) => city.trim()).filter(Boolean));
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTypes([...types, value]);
    } else {
      setTypes(types.filter((type) => type !== value));
    }
  };

  return (
    <div>
      <div className="hero-section">
        <div className="container"> {/* ✅ Змінено app-container на container */}
          <h1 className="hero-title">Знайдіть помешкання для наступної подорожі</h1>
          <p className="hero-subtitle">Знахoдьте пропозиції готелів, приватних помешкань та багато іншого...</p>
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>

      <div className="container mt-4"> {/* ✅ Змінено app-container на container */}
        <Offers />
        <h2 className="section-heading mt-5">Доступні помешкання</h2>
        <AccommodationFilters
          cities={cities}
          types={types}
          minDailyRate={minDailyRate}
          maxDailyRate={maxDailyRate}
          sortBy={sortBy}
          handleCityChange={handleCityChange}
          handleTypeChange={handleTypeChange}
          setMinDailyRate={setMinDailyRate}
          setMaxDailyRate={setMaxDailyRate}
          setSortBy={setSortBy}
        />
        {loading && <p className="text-center">Завантаження...</p>}
        {error && <Notification message={error} type="danger" />}
        {!loading && !error && (
          accommodations.length > 0 ? (
            <AccommodationList accommodations={accommodations} />
          ) : (
            <p className="text-center">Помешкань за вашим запитом не знайдено.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Accommodations;
