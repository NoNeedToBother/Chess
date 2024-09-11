package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.dto.auth.JwtRequest;
import ru.kpfu.itis.paramonov.dto.auth.JwtResponse;
import ru.kpfu.itis.paramonov.dto.auth.RefreshJwtRequest;
import ru.kpfu.itis.paramonov.dto.request.RegisterUserRequestDto;
import ru.kpfu.itis.paramonov.dto.response.AuthenticateResponseDto;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.service.AuthService;
import ru.kpfu.itis.paramonov.service.UserService;

import javax.security.auth.message.AuthException;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.NO_USER_FOUND_ERROR;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticateResponseDto> login(@RequestBody JwtRequest jwtRequest) {
        JwtResponse jwtResponse = authService.login(jwtRequest.getUsername(), jwtRequest.getPassword());
        UserDto user = userService.getByUsername(jwtRequest.getUsername()).orElseThrow(
                () -> new NotFoundException(NO_USER_FOUND_ERROR)
        );
        return new ResponseEntity<>(
                new AuthenticateResponseDto(user, jwtResponse), HttpStatus.OK);
    }

    @PostMapping("/token")
    public ResponseEntity<JwtResponse> token(@RequestBody RefreshJwtRequest jwtRequest) throws AuthException {
        return ResponseEntity.ok(authService.token(jwtRequest.getToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(@RequestBody RefreshJwtRequest jwtRequest) throws AuthException {
        return ResponseEntity.ok(authService.refresh(jwtRequest.getToken()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticateResponseDto> register(
            @RequestBody RegisterUserRequestDto registerUserRequestDto
    ) {
        String username = registerUserRequestDto.getUsername();
        String password = registerUserRequestDto.getPassword();

        authService.registerUser(username, password);

        JwtResponse jwtResponse = authService.login(username, password);
        UserDto user = userService.getByUsername(username).orElseThrow(
                RuntimeException::new
        );
        return new ResponseEntity<>(
                new AuthenticateResponseDto(user, jwtResponse), HttpStatus.CREATED);
    }
}
