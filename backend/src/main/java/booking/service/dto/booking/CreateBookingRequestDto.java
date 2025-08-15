package booking.service.dto.booking;

import booking.service.model.BookingStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@Accessors(chain = true)
public class CreateBookingRequestDto {

    @NotNull
    @Future(message = "Check-in date must be in the future")
    private LocalDate checkInDate;

    @NotNull
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;

    @NotNull
    private Long accommodationId;

    @NotNull
    private Long userId;

    @NotNull
    private BookingStatus status;
}
