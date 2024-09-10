package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.kpfu.itis.paramonov.dto.request.UpdateUserInfoRequest;
import ru.kpfu.itis.paramonov.dto.response.*;
import ru.kpfu.itis.paramonov.dto.users.BanDto;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.dto.request.BanUserRequestDto;
import ru.kpfu.itis.paramonov.dto.request.PromoteUserRequestDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;
import ru.kpfu.itis.paramonov.filter.jwt.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.BanService;
import ru.kpfu.itis.paramonov.service.UserService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        Optional<UserDto> banned = userService.getById(banUserRequestDto.getBannedId());
        return new ResponseEntity<>(
                new BanUserResponseDto(get(banned.get(), authentication).getBody()),
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
            @RequestParam("id") UserDto user,
            JwtAuthentication authentication
    ) {
        Long fromId = authentication.getId();
        boolean liked = userService.checkLike(user.getId(), fromId);
        boolean banned = userService.isBanned(user.getId());
        if (banned) {
            BanDto ban = banService.getLatestBan(user.getId());
            return new ResponseEntity<>(new UserResponseDto(user, liked, ban), HttpStatus.OK);
        }
        else return new ResponseEntity<>(new UserResponseDto(user, liked), HttpStatus.OK);
    }

    @GetMapping("/get/posts")
    public ResponseEntity<PostsResponseDto> getPosts(
            @RequestParam("id") UserDto user, @RequestParam("amount") Integer maxAmount
    ) {
        List<PostDto> posts = userService.getLastPosts(user.getId(), maxAmount);
        List<PostResponseDto> responses = posts.stream()
                .map(postDto -> new PostResponseDto(user, postDto)
                ).collect(Collectors.toList());
        return new ResponseEntity<>(new PostsResponseDto(responses), HttpStatus.OK);
    }

    @GetMapping("/update/like")
    public ResponseEntity<UserResponseDto> updateLike(
            @RequestParam("id") UserDto user, JwtAuthentication authentication
    ) {
        Long fromId = authentication.getId();
        userService.updateLike(user.getId(), fromId);
        user = userService.getById(user.getId()).get();
        return get(user, authentication);
    }

    @PostMapping(value = "/update/profile/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UpdateProfilePictureResponseDto> updateProfilePicture(
            @RequestPart("image") MultipartFile image,
            JwtAuthentication jwtAuthentication
    ) {
        Long userId = jwtAuthentication.getId();
        String url = userService.updateProfilePicture(userId, image);
        return new ResponseEntity<>(new UpdateProfilePictureResponseDto(url), HttpStatus.OK);
    }

    @PostMapping("/update/profile/info")
    public ResponseEntity<UserResponseDto> updateProfileInfo(
            @RequestBody UpdateUserInfoRequest updateUserInfoRequest,
            JwtAuthentication jwtAuthentication
    ) {
        Long userId = jwtAuthentication.getId();
        UserDto userDto = userService.updateUserInfo(userId,
                updateUserInfoRequest.getName(),
                updateUserInfoRequest.getLastname(),
                updateUserInfoRequest.getBio());

        return new ResponseEntity<>(new UserResponseDto(userDto), HttpStatus.OK);
    }
}
