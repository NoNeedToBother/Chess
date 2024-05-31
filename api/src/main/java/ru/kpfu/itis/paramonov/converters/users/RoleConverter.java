package ru.kpfu.itis.paramonov.converters.users;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.dto.users.RoleDto;
import ru.kpfu.itis.paramonov.model.Role;

@Component
public class RoleConverter implements Converter<Role, RoleDto> {
    @Override
    public RoleDto convert(Role source) {
        switch (source) {
            case USER:
                return RoleDto.USER;
            case MODERATOR:
                return RoleDto.MODERATOR;
            case ADMIN:
                return RoleDto.ADMIN;
            case CHIEF_ADMIN:
                return RoleDto.CHIEF_ADMIN;
            default:
                throw new IllegalArgumentException("Unsupported role: " + source.name());
        }
    }
}
