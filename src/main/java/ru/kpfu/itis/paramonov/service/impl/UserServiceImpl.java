package ru.kpfu.itis.paramonov.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.paramonov.converters.users.UserConverter;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.model.Role;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.service.UserService;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    private UserConverter userConverter;

    @Override
    public void registerUser(String username, String password) {
        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER);
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .roles(roles)
                .build();

        userRepository.save(user);
    }

    @Override
    public Optional<UserDto> getUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> userConverter.convert(value));
    }
}
