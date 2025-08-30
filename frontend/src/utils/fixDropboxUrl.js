// src/utils/fixDropboxUrl.js
export const fixDropboxUrl = (url) => {
  if (!url) return '';

  // Перевіряємо, чи посилання містить "dl=0"
  if (url.includes('dl=0')) {
    // Якщо так, замінюємо на "dl=1" для прямого доступу
    return url.replace('dl=0', 'dl=1');
  }

  // Якщо посилання вже має "raw=1" або інший формат, повертаємо без змін
  return url;
};
