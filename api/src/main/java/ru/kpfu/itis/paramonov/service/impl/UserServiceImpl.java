package ru.kpfu.itis.paramonov.service.impl;

import com.cloudinary.Cloudinary;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.paramonov.converters.posts.PostConverter;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.model.Role;
import ru.kpfu.itis.paramonov.repository.PostRepository;
import ru.kpfu.itis.paramonov.service.UserService;
import ru.kpfu.itis.paramonov.converters.users.UserConverter;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.UserRepository;
import ru.kpfu.itis.paramonov.repository.UserRoleRepository;
import ru.kpfu.itis.paramonov.utils.FileUtil;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.*;

@Slf4j
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private Cloudinary cloudinary;

    private UserRepository userRepository;

    private PostRepository postRepository;

    private UserRoleRepository userRoleRepository;

    private UserConverter userConverter;

    private PostConverter postConverter;

    @Override
    public Optional<UserDto> getById(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<UserDto> result = user.map(value -> userConverter.convert(value));
        if (result.isPresent()) {
            int likeAmount = userRepository.getLikeAmount(userId);
            result.get().setLikes(likeAmount);
        }
        return result;
    }

    @Override
    public Optional<UserDto> getByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(value -> userConverter.convert(value));
    }

    @Override
    public boolean hasModeratorAuthority(Long userId) {
        return userRoleRepository.hasModeratorAuthority(userId);
    }

    @Override
    public boolean hasAdminAuthority(Long userId) {
        return userRoleRepository.hasAdminAuthority(userId);
    }

    @Override
    public boolean isBanned(Long userId) {
        return userRepository.isBanned(userId);
    }

    @Override
    @Transactional
    public void ban(Long bannedId, String reason, Long fromId) {
        Optional<User> banned = userRepository.findById(bannedId);
        Optional<User> from = userRepository.findById(fromId);
        if (banned.isPresent() && from.isPresent()) {
            if (userRoleRepository.hasModeratorAuthority(fromId)) {
                checkAuthoritiesAndBanIfSatisfy(banned.get(), from.get(), reason);
            } else {
                throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
            }
        } else {
            throw new NotFoundException(NO_USER_FOUND_ERROR);
        }
    }

    private void checkAuthoritiesAndBanIfSatisfy(User banned, User from, String reason) {
        if (isModerator(from.getId()) && !hasAdminAuthority(from.getId())) {
            if (!hasModeratorAuthority(banned.getId())) {
                userRepository.ban(banned.getId(), from.getId(), reason);
            } else throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
        } else {
            if (isAdmin(from.getId()) && !isChiefAdmin(from.getId())) {
                if (!hasAdminAuthority(banned.getId())) {
                    userRepository.removeRole(banned.getId(), Role.MODERATOR.getAuthority());
                    userRepository.ban(banned.getId(), from.getId(), reason);
                } else throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
            } else {
                userRepository.removeRole(banned.getId(), Role.MODERATOR.getAuthority());
                userRepository.removeRole(banned.getId(), Role.ADMIN.getAuthority());
                userRepository.ban(banned.getId(), from.getId(), reason);
            }
        }
    }

    private boolean isModerator(Long id) {
        return userRepository.isModerator(id);
    }

    private boolean isAdmin(Long id) {
        return userRepository.isAdmin(id);
    }

    private boolean isChiefAdmin(Long id) {
        return userRepository.isChiefAdmin(id);
    }

    @Override
    @Transactional
    public void unban(Long bannedId, Long fromId) {
        if (isChiefAdmin(fromId) && !isChiefAdmin(bannedId)) userRepository.unban(bannedId, fromId);
        else if (isAdmin(fromId) && !hasAdminAuthority(bannedId)) userRepository.unban(bannedId, fromId);
        else if (isModerator(fromId) && !hasModeratorAuthority(bannedId)) userRepository.unban(bannedId, fromId);
        else throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
    }

    @Override
    @Transactional
    public void promote(Long promotedId, String role, Long fromId) {
        try {
            Role enumRole = Role.valueOf(role);
            if (enumRole == Role.USER) throw new InvalidParameterException(INCORRECT_ROLE_ERROR);

            Optional<User> promoted = userRepository.findById(promotedId);
            if (promoted.isPresent()) {
                if (hasAdminAuthority(fromId)) {
                    checkAuthoritiesAndPromoteIfSatisfy(promotedId, fromId, enumRole);
                } else {
                    throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
                }
            } else throw new NotFoundException(NO_USER_FOUND_ERROR);
        } catch (IllegalArgumentException e) {
            throw new InvalidParameterException(INCORRECT_ROLE_ERROR);
        }
    }

    @Override
    public boolean checkLike(Long userId, Long fromId) {
        return userRepository.checkLike(userId, fromId);
    }

    @Override
    public List<PostDto> getLastPosts(Long userId, Integer max) {
        return postRepository.findAllByUserId(userId, max)
                .stream().map( post -> postConverter.convert(post))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean updateLike(Long userId, Long fromId) {
        if (checkLike(userId, fromId)) {
            userRepository.removeLike(userId, fromId);
            return false;
        } else {
            userRepository.like(userId, fromId);
            return true;
        }
    }

    @Override
    @Transactional
    public String updateProfilePicture(Long userId, MultipartFile image) {
        try {
            File file = FileUtil.uploadPartImage(image);
            String url = cloudinary.uploader().upload(file, new HashMap<>()).get("secure_url").toString();
            userRepository.updateUserProfilePictureUrl(userId, url);
            return url;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserDto updateUserInfo(Long userId, String name, String lastname, String bio) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) throw new NotFoundException(NO_USER_FOUND_ERROR);

        User user = userOptional.get();
        if (name != null) user.setName(name);
        if (lastname != null) user.setLastname(lastname);
        if (bio != null) user.setBio(bio);
        User resultUser = userRepository.save(user);
        return userConverter.convert(resultUser);
    }

    public void checkAuthoritiesAndPromoteIfSatisfy(Long promotedId, Long fromId, Role role) {
        if (isAdmin(fromId) && !isChiefAdmin(fromId)) {
            if (role == Role.MODERATOR) {
                userRepository.promote(promotedId, role.getAuthority());
            } else throw new NoSufficientAuthorityException(NO_SUFFICIENT_AUTHORITY_ERROR);
        } else {
            userRepository.promote(promotedId, role.getAuthority());
        }
    }
}
