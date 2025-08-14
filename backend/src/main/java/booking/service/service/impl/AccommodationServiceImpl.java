package booking.service.service.impl;

import booking.service.dto.accommodation.AccommodationDto;
import booking.service.dto.accommodation.AccommodationSearchParametersDto;
import booking.service.dto.accommodation.CreateAccommodationRequestDto;
import booking.service.exception.EntityNotFoundException;
import booking.service.mapper.AccommodationMapper;
import booking.service.model.Accommodation;
import booking.service.repository.accommodation.AccommodationRepository;
import booking.service.repository.accommodation.AccommodationSpecificationBuilder;
import booking.service.service.AccommodationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccommodationServiceImpl implements AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final AccommodationMapper accommodationMapper;
    private final AccommodationSpecificationBuilder accommodationSpecificationBuilder;

    @Override
    public AccommodationDto save(CreateAccommodationRequestDto requestDto) {
        Accommodation accommodation = accommodationMapper.toEntity(requestDto);
        return accommodationMapper.toDto(accommodationRepository.save(accommodation));
    }

    @Override
    public Page<AccommodationDto> findAll(Pageable pageable) {
        return accommodationRepository.findAll(pageable)
                .map(accommodationMapper::toDto);
    }

    @Override
    public AccommodationDto findById(Long id) {
        Accommodation accommodation = accommodationRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Can't find accommodation by id: " + id)
        );
        return accommodationMapper.toDto(accommodation);
    }

    @Override
    public AccommodationDto update(Long id, CreateAccommodationRequestDto requestDto) {
        Accommodation accommodation = accommodationRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Can't find accommodation by id: " + id)
        );
        accommodationMapper.updateAccommodationFromDto(requestDto, accommodation);
        accommodationRepository.save(accommodation);
        return accommodationMapper.toDto(accommodation);
    }

    @Override
    public void deleteById(Long id) {
        if (!accommodationRepository.existsById(id)) {
            throw new EntityNotFoundException("Can't find accommodation by id: " + id);
        }
        accommodationRepository.deleteById(id);
    }

    @Override
    public Page<AccommodationDto> search(AccommodationSearchParametersDto params,
            Pageable pageable) {
        Specification<Accommodation> accommodationSpecificationSpecification =
                accommodationSpecificationBuilder.build(params);
        Page<Accommodation> accommodationPagePage = accommodationRepository
                .findAll(accommodationSpecificationSpecification, pageable);
        return accommodationPagePage.map(accommodationMapper::toDto);
    }
}

