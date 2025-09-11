import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPayments } from '../../store/slices/paymentsSlice';
import AdminTable from '../../pages/Admin/AdminTable';
import StatusBadge from '../../components/status/StatusBadge';

import '../../styles/components/admin/_admin-tables.scss';

const AdminPayments = () => {
  const dispatch = useDispatch();
  const { payments, fetchStatus, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  if (fetchStatus === 'loading') return <p className="text-center">Завантаження...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  //  колонки таблиці
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

      <AdminTable columns={columns} data={payments} />
    </div>
  );
};

export default AdminPayments;
