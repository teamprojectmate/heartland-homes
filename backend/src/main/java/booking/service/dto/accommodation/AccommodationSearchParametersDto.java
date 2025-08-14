package booking.service.dto.accommodation;

import booking.service.model.AccommodationType;
import java.math.BigDecimal;

public record AccommodationSearchParametersDto(
        String[] city,
        String[] size,
        AccommodationType[] type,
        BigDecimal minDailyRate,
        BigDecimal maxDailyRate
) {

}
