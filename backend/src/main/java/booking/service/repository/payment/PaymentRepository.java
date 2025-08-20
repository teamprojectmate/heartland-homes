package booking.service.repository.payment;

import booking.service.model.Payment;
import booking.service.model.PaymentStatus;
import booking.service.model.PaymentType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findAllByBookingIdIn(List<Long> bookingIds, Pageable pageable);

    Optional<Payment> findBySessionId(String sessionId);

    boolean existsByBookingIdAndPaymentTypeAndStatus(
            Long bookingId,
            PaymentType paymentType,
            PaymentStatus status
    );
}
