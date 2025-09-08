// src/pages/Admin/AdminPayments.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPayments } from '../../store/slices/paymentsSlice';
import AdminTable from '../../pages/Admin/AdminTable';
import StatusBadge from '../../components/status/StatusBadge';
import Pagination from '../../components/Pagination';

import '../../styles/components/admin/_admin-tables.scss';

const AdminPayments = () => {
  const dispatch = useDispatch();
  const { payments, fetchStatus, error, totalPages } = useSelector(
    (state) => state.payments
  );

  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAllPayments({ page, size: 5, status: statusFilter || undefined }));
  }, [dispatch, page, statusFilter]);

  if (fetchStatus === 'loading') return <p className="text-center">Завантаження...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'bookingId', label: 'Бронювання ID' },
    {
      key: 'amountToPay',
      label: 'Сума',
      render: (p) => `${p.amountToPay} грн`
    },
    { key: 'paymentType', label: 'Тип' },
    {
      key: 'status',
      label: 'Статус',
      render: (p) => <StatusBadge status={p.status} />
    }
  ];

  return (
    <div className="admin-payments container admin-page-container">
      <h1 className="section-heading text-center">Управління платежами</h1>

      {/* 🔹 Фільтр */}
      <div className="filter-bar mb-3 text-center">
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(0); // скидаємо на першу сторінку при зміні фільтра
            setStatusFilter(e.target.value);
          }}
        >
          <option value="">Всі</option>
          <option value="PENDING">Очікує оплату</option>
          <option value="PAID">Оплачено</option>
        </select>
      </div>

      <AdminTable columns={columns} data={payments} />

      {/* 🔹 Пагінація */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AdminPayments;
