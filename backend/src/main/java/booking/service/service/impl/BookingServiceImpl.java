package booking.service.service.impl;

import booking.service.dto.booking.BookingDto;
import booking.service.dto.booking.CreateBookingRequestDto;
import booking.service.mapper.BookingMapper;
import booking.service.model.Accommodation;
import booking.service.model.Booking;
import booking.service.model.BookingStatus;
import booking.service.model.RoleName;
import booking.service.model.User;
import booking.service.repository.accommodation.AccommodationRepository;
import booking.service.repository.booking.BookingRepository;
import booking.service.repository.user.UserRepository;
import booking.service.service.BookingService;
import booking.service.service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;
    private final NotificationService notificationService;

    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }

    private boolean isManager(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleName.MANAGER);
    }

    @Override
    @Transactional
    public BookingDto create(CreateBookingRequestDto requestDto, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);

        Accommodation accommodation = accommodationRepository.findById(
                        requestDto.getAccommodationId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Accommodation not found with id: " + requestDto.getAccommodationId()));

        if (bookingRepository.existsByAccommodationIdAndDateOverlap(
                accommodation.getId(),
                requestDto.getCheckInDate(),
                requestDto.getCheckOutDate()
        )) {
            throw new IllegalStateException("Accommodation is already booked for these dates.");
        }

        Booking booking = bookingMapper.toEntity(requestDto)
                .setAccommodation(accommodation)
                .setUser(currentUser)
                .setStatus(BookingStatus.PENDING);

        bookingRepository.save(booking);

        notificationService.sendMessage(String.format(
                "🏨 Створено нове бронювання!\n"
                        + "Користувач: %s\n"
                        + "Житло: %s (%s)\n"
                        + "Дата заїзду: %s\n"
                        + "Дата виїзду: %s",
                currentUser.getEmail(),
                accommodation.getLocation(),
                accommodation.getCity(),
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        ));

        return bookingMapper.toDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingDto> findByUserAndStatus(Long userId, BookingStatus status,
            Authentication authentication, Pageable pageable) {
        User currentUser = getCurrentUser(authentication);
        boolean isManager = isManager(currentUser);

        if (!isManager && userId != null && !userId.equals(currentUser.getId())) {
            throw new AccessDeniedException(
                    "You are not allowed to view bookings of another user.");
        }

        if (!isManager && userId == null) {
            userId = currentUser.getId();
        }

        Page<Booking> bookings;

        if (userId != null && status != null) {
            bookings = bookingRepository.findByUserIdAndStatus(userId, status, pageable);
        } else if (userId != null) {
            bookings = bookingRepository.findByUserId(userId, pageable);
        } else if (status != null) {
            bookings = bookingRepository.findByStatus(status, pageable);
        } else {
            bookings = bookingRepository.findAll(pageable);
        }

        return bookings.map(bookingMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingDto> findMyBookings(Pageable pageable, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        return bookingRepository.findByUserId(currentUser.getId(), pageable)
                .map(bookingMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingDto findById(Long id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        boolean isManager = isManager(currentUser);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));

        if (!isManager && !booking.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not allowed to view this booking.");
        }

        return bookingMapper.toDto(booking);
    }

    @Override
    @Transactional
    public BookingDto update(Long id, CreateBookingRequestDto requestDto) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));

        bookingMapper.updateBookingFromDto(requestDto, booking);

        bookingRepository.save(booking);

        return bookingMapper.toDto(booking);
    }

    @Override
    @Transactional
    public void cancel(Long id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        boolean isManager = isManager(currentUser);

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));

        if (!isManager && !booking.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not allowed to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.CANCELED) {
            throw new IllegalStateException("Booking already canceled.");
        }

        booking.setStatus(BookingStatus.CANCELED);
        bookingRepository.save(booking);

        notificationService.sendMessage(String.format(
                "❌ Бронювання скасовано!\n"
                        + "Користувач: %s\n"
                        + "Житло: %s (%s)\n"
                        + "Дата заїзду: %s\n"
                        + "Дата виїзду: %s",
                booking.getUser().getEmail(),
                booking.getAccommodation().getLocation(),
                booking.getAccommodation().getCity(),
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        ));
    }
}