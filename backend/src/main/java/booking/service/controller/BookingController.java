package booking.service.controller;

import booking.service.dto.booking.BookingDto;
import booking.service.dto.booking.CreateBookingRequestDto;
import booking.service.model.BookingStatus;
import booking.service.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Booking management", description = "Endpoints for managing bookings")
@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    @PreAuthorize("hasAnyRole('CUSTOMER', 'MANAGER')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new booking", description = "Create a new accommodation booking")
    public BookingDto create(@RequestBody @Valid CreateBookingRequestDto requestDto,
            Authentication authentication) {
        return bookingService.create(requestDto, authentication);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    @Operation(summary = "Find bookings by user and status",
            description = "Retrieve bookings filtered by user ID and status (managers only)")
    public Page<BookingDto> findByUserAndStatus(
            @RequestParam(name = "user_id", required = false) Long userId,
            @RequestParam(name = "status", required = false) BookingStatus status,
            Authentication authentication, Pageable pageable) {
        return bookingService.findByUserAndStatus(userId, status, authentication, pageable);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'MANAGER')")
    @GetMapping("/my")
    @Operation(summary = "Get current user's bookings",
            description = "Retrieve all bookings for the authenticated user")
    public Page<BookingDto> findMyBookings(Pageable pageable, Authentication authentication) {
        return bookingService.findMyBookings(pageable, authentication);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'MANAGER')")
    @GetMapping("/{id}")
    @Operation(summary = "Get booking details", description = "Retrieve booking information by ID")
    public BookingDto findById(@PathVariable Long id, Authentication authentication) {
        return bookingService.findById(id, authentication);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'MANAGER')")
    @PutMapping("/{id}")
    @Operation(summary = "Update booking", description = "Update booking details by ID")
    public BookingDto update(@PathVariable Long id,
            @RequestBody @Valid CreateBookingRequestDto requestDto) {
        return bookingService.update(id, requestDto);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'MANAGER')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cancel booking", description = "Cancel a booking by ID")
    public void cancel(@PathVariable Long id, Authentication authentication) {
        bookingService.cancel(id, authentication);
    }
}