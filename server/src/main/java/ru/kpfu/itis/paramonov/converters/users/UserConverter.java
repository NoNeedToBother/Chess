package ru.kpfu.itis.paramonov.converters.users;

import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.model.User;

import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class UserConverter implements Converter<User, UserDto> {

    private RoleConverter roleConverter;

    @Override
    public UserDto convert(User source) {
        return UserDto.builder()
                .id(source.getId())
                .username(source.getUsername())
                .name(source.getName())
                .lastname(source.getLastname())
                .bio(source.getBio())
                .enabled(source.isEnabled())
                .deactivated(source.isDeactivated())
                .dateRegistered(source.getDateRegistered())
                .profilePicture(source.getProfilePicture())
                .roles(source.getRoles()
                        .stream().map(role -> roleConverter.convert(role))
                        .collect(Collectors.toList()))
                .build();
    }

}
