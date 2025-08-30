import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentsByUser } from '../../store/slices/paymentsSlice';
import Notification from '../../components/Notification';

const PaymentsList = () => {
  const dispatch = useDispatch();
  const { payments, status, error } = useSelector((state) => state.payments);
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Прибрали 'user' та 'token', оскільки вони не потрібні

  useEffect(() => {
    // ✅ Просто перевіряємо автентифікацію
    if (isAuthenticated) {
      dispatch(
        fetchPaymentsByUser({
          pageable: { page: 0, size: 10, sort: ['id,desc'] }
        })
      );
    }
  }, [dispatch, isAuthenticated]);

  if (status === 'loading') return <p className="text-center">Завантаження...</p>;
  if (error) return <Notification message={error} type="danger" />;

  return (
    <div className="container page">
      <h2 className="auth-title">Мої платежі</h2>
      {payments.length === 0 ? (
        <p>У вас ще немає платежів.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Бронювання</th>
              <th>Сума</th>
              <th>Тип</th>
              <th>Статус</th>
              <th>Сесія</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.bookingId}</td>
                <td>{p.amountToPay} ₴</td>
                <td>{p.paymentType}</td>
                <td>
                  <span
                    className={`badge ${p.status === 'SUCCESS' ? 'bg-success' : 'bg-warning'}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  {p.sessionUrl ? (
                    <a href={p.sessionUrl} target="_blank" rel="noreferrer">
                      Відкрити
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentsList;
