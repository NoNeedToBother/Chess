package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.paramonov.dto.response.*;
import ru.kpfu.itis.paramonov.dto.users.BanDto;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.dto.request.BanUserRequestDto;
import ru.kpfu.itis.paramonov.dto.request.PromoteUserRequestDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.filter.jwt.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.BanService;
import ru.kpfu.itis.paramonov.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.NO_USER_FOUND_ERROR;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    private BanService banService;

    @PostMapping("/moderator/ban")
    public ResponseEntity<BanUserResponseDto> ban(@RequestBody BanUserRequestDto banUserRequestDto, JwtAuthentication authentication) {
        Long fromId = authentication.getId();
        userService.ban(banUserRequestDto.getBannedId(), banUserRequestDto.getReason(), fromId);
        return new ResponseEntity<>(
                new BanUserResponseDto(get(banUserRequestDto.getBannedId(), authentication).getBody()),
                HttpStatus.OK
        );
    }

    @GetMapping("/moderator/unban")
    public ResponseEntity<BaseResponseDto> unban(@RequestParam Long id, JwtAuthentication authentication) {
        Long fromId = authentication.getId();
        userService.unban(id, fromId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/ban")
    public ResponseEntity<BanUserResponseDto> banAdmin(@RequestBody BanUserRequestDto banUserRequestDto,
                                                    JwtAuthentication authentication) {
        return ban(banUserRequestDto, authentication);
    }

    @GetMapping("/admin/unban")
    public ResponseEntity<BaseResponseDto> unbanAdmin(@RequestParam Long id, JwtAuthentication authentication) {
        return unban(id, authentication);
    }

    @PostMapping("/admin/promote")
    public ResponseEntity<BaseResponseDto> promote(@RequestBody PromoteUserRequestDto promoteUserRequestDto,
                                                   JwtAuthentication authentication) {
        Long fromId = authentication.getId();
        userService.promote(
                promoteUserRequestDto.getPromotedId(), promoteUserRequestDto.getRole(), fromId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get")
    public ResponseEntity<UserResponseDto> get(
            @RequestParam("id") Long userId,
            JwtAuthentication authentication
    ) {
        Long fromId = authentication.getId();
        Optional<UserDto> user = userService.getById(userId);
        if (user.isPresent()) {
            boolean liked = userService.checkLike(userId, fromId);
            boolean banned = userService.isBanned(userId);
            if (banned) {
                BanDto ban = banService.getLatestBan(userId);
                return new ResponseEntity<>(new UserResponseDto(user.get(), liked, ban), HttpStatus.OK);
            }
            else return new ResponseEntity<>(new UserResponseDto(user.get(), liked), HttpStatus.OK);
        } else throw new NotFoundException(NO_USER_FOUND_ERROR);
    }

    @GetMapping("/get/posts")
    public ResponseEntity<PostsResponseDto> getPosts(
            @RequestParam("id") Long userId, @RequestParam("amount") Integer maxAmount
    ) {
        Optional<UserDto> user = userService.getById(userId);
        if (user.isPresent()) {
            List<PostDto> posts = userService.getLastPosts(userId, maxAmount);
            List<PostResponseDto> responses = posts.stream()
                    .map(postDto -> new PostResponseDto(user.get(), postDto)
                    ).collect(Collectors.toList());
            return new ResponseEntity<>(new PostsResponseDto(responses), HttpStatus.OK);
        } else throw new NotFoundException(NO_USER_FOUND_ERROR);
    }

    @GetMapping("/update/like")
    public ResponseEntity<UserResponseDto> updateLike(
            @RequestParam("id") Long userId, JwtAuthentication authentication
    ) {
        Long fromId = authentication.getId();
        Optional<UserDto> user = userService.getById(userId);
        if (user.isPresent()) {
            userService.updateLike(userId, fromId);
            return get(userId, authentication);
        } else throw new NotFoundException(NO_USER_FOUND_ERROR);
    }
}
