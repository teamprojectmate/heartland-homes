// src/utils/fixDropboxUrl.js
export const fixDropboxUrl = (url) => {
  if (!url) return '';

  // Беремо базову частину посилання до "?" (без параметрів)
  const [base] = url.split('?');

  // Формуємо новий правильний URL для прямого доступу до картинки
  return `${base}?raw=1`;
};
