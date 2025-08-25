import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // якщо всього одна сторінка — не показуємо

  return (
    <div className="pagination d-flex justify-content-center align-items-center mt-4 gap-2">
      <button
        className="btn-outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        ◀ Попередня
      </button>

      <span>
        Сторінка {page + 1} із {totalPages}
      </span>

      <button
        className="btn-outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Наступна ▶
      </button>
    </div>
  );
};

export default Pagination;
