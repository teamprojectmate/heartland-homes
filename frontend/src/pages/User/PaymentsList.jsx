import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentsByUser } from '../../store/slices/paymentsSlice';
import Notification from '../../components/Notification';
import Pagination from '../../components/Pagination';
import PaymentStatusBadge from '../../components/status/PaymentStatusBadge';
import '../../styles/components/payment/_payments-list.scss';

const PaymentsList = () => {
  const dispatch = useDispatch();
  const { payments, fetchStatus, error, totalPages } = useSelector(
    (state) => state.payments
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(0);
  const size = 5;

  const pageable = useMemo(() => ({ page, size, sort: ['id,desc'] }), [page]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchPaymentsByUser({ userId: user.id, pageable }));
    }
  }, [dispatch, isAuthenticated, user, pageable]);

  if (fetchStatus === 'loading') return <p className="text-center">Завантаження...</p>;
  if (error) return <Notification message={error} type="danger" />;

  return (
    <div className="container payments-page">
      <h2 className="auth-title">Мої платежі</h2>

      {payments.length === 0 ? (
        <p className="text-center">У вас ще немає платежів.</p>
      ) : (
        <>
          <div className="payments-grid">
            {payments.map((p) => (
              <div className={`payment-card ${p.status.toLowerCase()}`} key={p.id}>
                <div className="payment-card-header">
                  <h4>
                    <span className="icon-chip">💳</span> Платіж #{p.id}
                  </h4>
                  <PaymentStatusBadge status={p.status} />
                </div>

                <div className="payment-card-body">
                  <p>
                    <strong>Бронювання:</strong> {p.bookingId}
                  </p>
                  <div className="payment-amount">
                    <div className="left">
                      <span className="icon">💰</span>
                      {p.amountToPay} ₴
                    </div>
                    <img src="/assets/visa.svg" alt="VISA" className="system-logo" />
                  </div>
                  <p>
                    <strong>Тип:</strong> {p.paymentType}
                  </p>
                </div>

                <div className="payment-card-footer">
                  {p.status !== 'PAID' && p.sessionUrl ? (
                    <a
                      href={p.sessionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      Оплатити
                    </a>
                  ) : (
                    <span className="btn btn-sm btn-success">✅ Оплачено</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
};

export default PaymentsList;
