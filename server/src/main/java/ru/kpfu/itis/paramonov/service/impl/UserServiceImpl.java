package ru.kpfu.itis.paramonov.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.paramonov.dto.request.BanUserRequestDto;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.service.UserService;
import ru.kpfu.itis.paramonov.converters.users.UserConverter;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.repository.UserRoleRepository;

import java.util.Optional;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.NO_SUFFICIENT_AUTHORITY_ERROR;
import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.NO_USER_FOUND_ERROR;

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
        return userRoleRepository.hasModeratorAuthority(userId);
    }

    @Override
    public boolean isAdmin(Long userId) {
        return userRoleRepository.hasAdminAuthority(userId);
    }

    @Override
    public boolean isBanned(Long userId) {
        return userRepository.isBanned(userId);
    }

    @Override
    public void ban(BanUserRequestDto requestDto, Long fromId) {
        Long bannedId = requestDto.getBannedId();
        String reason = requestDto.getReason();

        Optional<User> banned = userRepository.findById(bannedId);
        Optional<User> from = userRepository.findById(fromId);
        if (banned.isPresent() && from.isPresent()) {
            if (userRoleRepository.hasModeratorAuthority(bannedId)) {
                //if (userRepository.isAdmin(banned.get().getId()) )
            } else {
                throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
            }
        } else {
            throw new NotFoundException(NO_USER_FOUND_ERROR);
        }
    }

    @Override
    public void unban(Long bannedId, Long fromId) {

    }




}
