package booking.service.util;

import booking.service.dto.accommodation.AccommodationDto;
import booking.service.dto.accommodation.CreateAccommodationRequestDto;
import booking.service.model.Accommodation;
import booking.service.model.AccommodationType;
import java.math.BigDecimal;
import java.util.List;

public class AccommodationUtil {
    public static AccommodationDto createAccommodationDto(Long id) {
        return new AccommodationDto()
                .setId(id)
                .setType(AccommodationType.HOUSE)
                .setLocation("Київська область, м. Київ, вул. Хрещатик, 12")
                .setCity("Київ")
                .setSize("3 Bedroom")
                .setAmenities(List.of("Wi-Fi", "Кондиціонер", "Пральна машина"))
                .setDailyRate(BigDecimal.valueOf(2500.00))
                .setImage("http://img/1");
    }

    public static List<Accommodation> createListOfAccommodations() {
        Accommodation a1 = new Accommodation()
                .setId(1L)
                .setType(AccommodationType.HOUSE)
                .setLocation("Київська область, м. Київ, вул. Хрещатик, 12")
                .setCity("Київ")
                .setSize("3 Bedroom")
                .setAmenities(List.of("Wi-Fi", "Кондиціонер", "Пральна машина"))
                .setDailyRate(BigDecimal.valueOf(2500.00))
                .setImage("http://img/1")
                .setDeleted(false);
        Accommodation a2 = new Accommodation()
                .setId(2L)
                .setType(AccommodationType.APARTMENT)
                .setLocation("Львівська область, м. Львів, просп. Свободи, 45, кв. 12, поверх 3")
                .setCity("Львів")
                .setSize("1 Bedroom")
                .setAmenities(List.of("Wi-Fi", "Кухня", "Балкон"))
                .setDailyRate(BigDecimal.valueOf(1800.00))
                .setImage("http://img/2")
                .setDeleted(false);
        Accommodation a3 = new Accommodation()
                .setId(3L)
                .setType(AccommodationType.VACATION_HOME)
                .setLocation("Одеська область, м. Одеса, вул. Шевченка, 8")
                .setCity("Одеса")
                .setSize("4 Bedroom")
                .setAmenities(List.of("Wi-Fi", "Кухня", "Парковка"))
                .setDailyRate(BigDecimal.valueOf(3200.00))
                .setImage("http://img/3")
                .setDeleted(false);
        Accommodation a4 = new Accommodation()
                .setId(4L)
                .setType(AccommodationType.CONDO)
                .setLocation("Харківська область, м. Харків, вул. Сумська, 101, кв. 45, поверх 7")
                .setCity("Харків")
                .setSize("2 Bedroom")
                .setAmenities(List.of("Wi-Fi", "Кондиціонер", "Пральна машина"))
                .setDailyRate(BigDecimal.valueOf(2100.00))
                .setImage("http://img/4")
                .setDeleted(false);
        return List.of(a1, a2, a3, a4);
    }

    public static CreateAccommodationRequestDto createAccommodationRequestDto() {
        return new CreateAccommodationRequestDto()
                .setType(AccommodationType.HOUSE)
                .setLocation("Київська область, м. Київ, вул. Хрещатик, 12")
                .setCity("Київ")
                .setSize("3 Bedroom")
                .setAmenities(List.of("Wi-Fi", "Кондиціонер", "Пральна машина"))
                .setDailyRate(BigDecimal.valueOf(2500.00))
                .setImage("http://img/1");
    }

    public static CreateAccommodationRequestDto createAccommodationBadRequestDto() {
        return new CreateAccommodationRequestDto()
                .setType(null)
                .setLocation("")
                .setCity("")
                .setSize("")
                .setAmenities(List.of(""))
                .setDailyRate(BigDecimal.valueOf(-1))
                .setImage("");
    }

    public static CreateAccommodationRequestDto createUpdatedAccommodationRequestDto() {
        return new CreateAccommodationRequestDto()
                .setType(AccommodationType.APARTMENT)
                .setLocation("Львівська область, м. Львів, просп. Свободи, 45, кв. 12, поверх 3")
                .setCity("Львів")
                .setSize("1 Bedroom")
                .setAmenities(List.of("Wi-Fi", "Кондиціонер", "Пральна машина"))
                .setDailyRate(BigDecimal.valueOf(1800.00))
                .setImage("http://img/2");
    }
}


