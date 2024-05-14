package ru.kpfu.itis.paramonov.service;

import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.dto.request.BanUserRequestDto;
import ru.kpfu.itis.paramonov.dto.request.PromoteUserRequestDto;

import java.util.Optional;

public interface UserService {

    Optional<UserDto> getById(Long userId);

    boolean hasModeratorAuthority(Long userId);

    boolean hasAdminAuthority(Long userId);

    boolean isBanned(Long userId);

    void ban(BanUserRequestDto requestDto, Long fromId);

    void unban(Long bannedId, Long fromId);

    void promote(PromoteUserRequestDto promoteUserRequestDto, Long fromId);
}
