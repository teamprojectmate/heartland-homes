package booking.service.service;

import booking.service.dto.accommodation.AccommodationDto;
import booking.service.dto.accommodation.AccommodationSearchParametersDto;
import booking.service.dto.accommodation.CreateAccommodationRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccommodationService {

    AccommodationDto save(CreateAccommodationRequestDto requestDto);

    Page<AccommodationDto> findAll(Pageable pageable);

    AccommodationDto findById(Long id);

    AccommodationDto update(Long id, CreateAccommodationRequestDto requestDto);

    void deleteById(Long id);

    Page<AccommodationDto> search(AccommodationSearchParametersDto params, Pageable pageable);
}
