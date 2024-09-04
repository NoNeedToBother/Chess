package ru.kpfu.itis.paramonov.service;

import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Optional<UserDto> getById(Long userId);

    Optional<UserDto> getByUsername(String username);

    boolean hasModeratorAuthority(Long userId);

    boolean hasAdminAuthority(Long userId);

    boolean isBanned(Long userId);

    void ban(Long bannedId, String reason, Long fromId);

    void unban(Long bannedId, Long fromId);

    void promote(Long promotedId, String role, Long fromId);

    boolean checkLike(Long userId, Long fromId);

    List<PostDto> getLastPosts(Long userId, Integer max);

    boolean updateLike(Long userId, Long fromId);

    String updateProfilePicture(Long userId, MultipartFile image);

    UserDto updateUserInfo(Long userId, String name, String lastname, String bio);
}
