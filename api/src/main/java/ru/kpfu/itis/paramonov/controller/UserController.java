package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.paramonov.dto.request.BanUserRequestDto;
import ru.kpfu.itis.paramonov.dto.request.PromoteUserRequestDto;
import ru.kpfu.itis.paramonov.dto.response.BaseResponseDto;
import ru.kpfu.itis.paramonov.exceptions.InvalidParameterException;
import ru.kpfu.itis.paramonov.exceptions.NoSufficientAuthorityException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.filter.JwtAuthentication;
import ru.kpfu.itis.paramonov.service.UserService;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

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
}
