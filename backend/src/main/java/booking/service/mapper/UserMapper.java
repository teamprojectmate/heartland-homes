package booking.service.mapper;

import booking.service.config.MapperConfig;
import booking.service.dto.user.UserRegistrationRequestDto;
import booking.service.dto.user.UserResponseDto;
import booking.service.model.User;
import org.mapstruct.Mapper;

@Mapper(config = MapperConfig.class)
public interface UserMapper {

    UserResponseDto toDto(User user);

    User toModel(UserRegistrationRequestDto requestDto);
}
