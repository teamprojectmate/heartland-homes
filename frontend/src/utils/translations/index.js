// --------------------
// 🏠 Типи житла
// --------------------
export const typeTranslations = {
  house: { label: 'Будинок', icon: '🏠', color: '#16a34a' }, // зелений
  apartment: { label: 'Квартира', icon: '🏢', color: '#2563eb' }, // синій
  hotel: { label: 'Готель', icon: '🏨', color: '#9333ea' }, // фіолетовий
  vacation_home: { label: 'Дім для відпочинку', icon: '🌴', color: '#f59e0b' }, // помаранчевий
  hostel: { label: 'Хостел', icon: '🛏️', color: '#06b6d4' }, // бірюзовий
  cottage: { label: 'Котедж', icon: '🏡', color: '#8b5cf6' } // фіолетовий
};

// --------------------
// 🔧 Зручності
// --------------------
export const amenityTranslations = {
  'wi-fi': { label: 'Wi-Fi', icon: '📶', slug: 'wifi', color: '#3b82f6' },
  кухня: { label: 'Кухня', icon: '🍳', slug: 'kitchen', color: '#f97316' },
  кондиціонер: { label: 'Кондиціонер', icon: '❄️', slug: 'ac', color: '#06b6d4' },
  парковка: { label: 'Парковка', icon: '🅿️', slug: 'parking', color: '#16a34a' },
  'пральна машина': {
    label: 'Пральна машина',
    icon: '🧺',
    slug: 'washer',
    color: '#8b5cf6'
  }
};

// --------------------
// ⚙️ mapType
// --------------------
import slugify from '../slugify';

export const mapType = (type = '') => {
  // робимо slug в kebab-case
  const rawSlug = slugify(type);
  const slug = rawSlug.replace(/_/g, '-'); // 🔹 замінюємо `_` на `-`

  const match = typeTranslations[rawSlug];
  if (match) {
    return { slug, ...match };
  }

  return { slug, label: type, icon: '🏘️', color: '#0f766e' };
};

// --------------------
// ⚙️ mapAmenity
// --------------------
export const mapAmenity = (amenity = '') => {
  const lower = amenity.toLowerCase();

  for (const key in amenityTranslations) {
    if (lower.includes(key)) {
      return amenityTranslations[key];
    }
  }

  return { label: amenity, icon: '✨', slug: 'other', color: '#6b7280' };
};