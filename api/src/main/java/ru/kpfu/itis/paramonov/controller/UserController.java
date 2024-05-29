package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.paramonov.dto.UserDto;
import ru.kpfu.itis.paramonov.dto.request.BanUserRequestDto;
import ru.kpfu.itis.paramonov.dto.request.PromoteUserRequestDto;
import ru.kpfu.itis.paramonov.dto.response.BaseResponseDto;
import ru.kpfu.itis.paramonov.dto.response.PostResponseDto;
import ru.kpfu.itis.paramonov.dto.response.PostsResponseDto;
import ru.kpfu.itis.paramonov.dto.response.UserResponseDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.filter.jwt.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.PostService;
import ru.kpfu.itis.paramonov.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.INTERNAL_SERVER_ERROR;
import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.NO_USER_FOUND_ERROR;

@Slf4j
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    private PostService postService;

    @PostMapping("/moderator/ban")
    public ResponseEntity<BaseResponseDto> ban(@RequestBody BanUserRequestDto banUserRequestDto, JwtAuthentication authentication) {
        try {
            Long fromId = authentication.getId();
            userService.ban(banUserRequestDto, fromId);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (NoSufficientAuthorityException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new BaseResponseDto(INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/moderator/unban")
    public ResponseEntity<BaseResponseDto> unban(@RequestParam Long id, JwtAuthentication authentication) {
        try {
            Long fromId = authentication.getId();
            userService.unban(id, fromId);
            return ResponseEntity.ok().build();
        } catch (NoSufficientAuthorityException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new BaseResponseDto(INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/admin/ban")
    public ResponseEntity<BaseResponseDto> banAdmin(@RequestBody BanUserRequestDto banUserRequestDto, JwtAuthentication authentication) {
        return ban(banUserRequestDto, authentication);
    }

    @GetMapping("/admin/unban")
    public ResponseEntity<BaseResponseDto> unbanAdmin(@RequestParam Long id, JwtAuthentication authentication) {
        return unban(id, authentication);
    }

    @PostMapping("/admin/promote")
    public ResponseEntity<BaseResponseDto> promote(@RequestBody PromoteUserRequestDto promoteUserRequestDto, JwtAuthentication authentication) {
        try {
            Long fromId = authentication.getId();
            userService.promote(promoteUserRequestDto, fromId);
            return ResponseEntity.ok().build();
        } catch (NoSufficientAuthorityException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (InvalidParameterException e) {
            return new ResponseEntity<>(new BaseResponseDto(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(new BaseResponseDto(INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<UserResponseDto> get(
            @RequestParam("id") Long userId,
            JwtAuthentication authentication
    ) {
        try {
            Long fromId = authentication.getId();
            Optional<UserDto> user = userService.getById(userId);
            if (user.isPresent()) {
                boolean liked = userService.checkLike(userId, fromId);
                boolean banned = userService.isBanned(userId);
                return new ResponseEntity<>(new UserResponseDto(user.get(), liked, banned), HttpStatus.OK);
            } else return new ResponseEntity<>(new UserResponseDto(NO_USER_FOUND_ERROR), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new UserResponseDto(INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/get/posts")
    public ResponseEntity<PostsResponseDto> getPosts(
            @RequestParam("id") Long userId, @RequestParam("amount") Integer maxAmount
    ) {
        try {
            Optional<UserDto> user = userService.getById(userId);
            if (user.isPresent()) {
                List<PostDto> posts = userService.getLastPosts(userId, maxAmount);
                List<PostResponseDto> responses = posts.stream()
                        .map(postDto -> new PostResponseDto(user.get(), postDto)
                        ).collect(Collectors.toList());
                return new ResponseEntity<>(new PostsResponseDto(responses), HttpStatus.OK);
            } else return new ResponseEntity<>(new PostsResponseDto(NO_USER_FOUND_ERROR), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new PostsResponseDto(INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/update/like")
    public ResponseEntity<UserResponseDto> updateLike(
            @RequestParam("id") Long userId, JwtAuthentication authentication
    ) {
        try {
            Long fromId = authentication.getId();
            Optional<UserDto> user = userService.getById(userId);
            if (user.isPresent()) {
                userService.updateLike(userId, fromId);
                return get(userId, authentication);
            } else return new ResponseEntity<>(new UserResponseDto(NO_USER_FOUND_ERROR), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(new UserResponseDto(INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
