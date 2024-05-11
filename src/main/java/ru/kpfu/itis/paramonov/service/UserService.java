package ru.kpfu.itis.paramonov.service;

import ru.kpfu.itis.paramonov.dto.UserDto;

import java.util.Optional;

public interface UserService {

    Optional<UserDto> getById(Long userId);
}
