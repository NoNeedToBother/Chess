package ru.kpfu.itis.paramonov.service;

import ru.kpfu.itis.paramonov.dto.UserDto;

import java.util.Optional;

public interface UserService {

    void registerUser(String username, String password);

    Optional<UserDto> getUser(Long userId);
}
