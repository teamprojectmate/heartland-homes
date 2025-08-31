/**
 * Перетворює рядок у slug
 * Напр. "Vacation Home" -> "vacation_home"
 */
const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, ''); // видаляє спецсимволи

export default slugify;
