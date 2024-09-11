package ru.kpfu.itis.paramonov.converters.parameters;

import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.service.UserService;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.NO_USER_FOUND_ERROR;

@AllArgsConstructor
@Component
public class IdToUserConverter implements Converter<String, UserDto> {

    private UserService userService;

    @Override
    public UserDto convert(@NotNull String source) {
        return userService.getById(Long.parseLong(source))
                .orElseThrow(() -> new NotFoundException(NO_USER_FOUND_ERROR));
    }
}
