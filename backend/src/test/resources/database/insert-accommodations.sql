INSERT INTO accommodations (id, type, location, city, size, daily_rate, image, is_deleted) VALUES
    (1, 'HOUSE', 'Київська область, м. Київ, вул. Хрещатик, 12', 'Київ', '3 Bedroom', 2500.00, 'http://img/1', 0),
    (2, 'APARTMENT', 'Львівська область, м. Львів, просп. Свободи, 45, кв. 12, поверх 3', 'Львів', '1 Bedroom', 1800.00, 'http://img/2', 0),
    (3, 'VACATION_HOME', 'Одеська область, м. Одеса, вул. Шевченка, 8', 'Одеса', '4 Bedroom', 3200.00, 'http://img/3', 0),
    (4, 'CONDO', 'Харківська область, м. Харків, вул. Сумська, 101, кв. 45, поверх 7', 'Харків', '2 Bedroom', 2100.00, 'http://img/4', 0);

INSERT INTO accommodation_amenities (accommodation_id, amenity) VALUES
    (1, 'Wi-Fi'), (1, 'Кондиціонер'), (1, 'Пральна машина'),
    (2, 'Wi-Fi'), (2, 'Кухня'), (2, 'Балкон'),
    (3, 'Wi-Fi'), (3, 'Кухня'), (3, 'Парковка'),
    (4, 'Wi-Fi'), (4, 'Кондиціонер'), (4, 'Пральна машина');
