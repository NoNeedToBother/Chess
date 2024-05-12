package ru.kpfu.itis.paramonov.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.paramonov.service.UserService;
import ru.kpfu.itis.paramonov.converters.users.UserConverter;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.repository.UserRoleRepository;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    private UserRoleRepository userRoleRepository;

    private UserConverter userConverter;

    @Override
    public Optional<UserDto> getById(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> userConverter.convert(value));
    }

    @Override
    public boolean isModerator(Long userId) {
        return userRoleRepository.isModerator(userId);
    }

    @Override
    public boolean isAdmin(Long userId) {
        return userRoleRepository.isAdmin(userId);
    }
}
