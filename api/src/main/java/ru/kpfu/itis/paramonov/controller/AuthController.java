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
import ru.kpfu.itis.paramonov.exceptions.InvalidCredentialsException;
import ru.kpfu.itis.paramonov.exceptions.NotFoundException;
import ru.kpfu.itis.paramonov.service.AuthService;
import ru.kpfu.itis.paramonov.service.UserService;

import javax.security.auth.message.AuthException;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticateResponseDto> login(@RequestBody JwtRequest jwtRequest) {
        try {
            JwtResponse jwtResponse = authService.login(jwtRequest);
            UserDto user = userService.getByUsername(jwtRequest.getUsername()).get();
            return new ResponseEntity<>(
                    new AuthenticateResponseDto(user, jwtResponse), HttpStatus.OK);
        } catch (InvalidCredentialsException e) {
            return new ResponseEntity<>(
                    new AuthenticateResponseDto(e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        } catch (NotFoundException e) {
            return new ResponseEntity<>(
                    new AuthenticateResponseDto(e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new AuthenticateResponseDto(REGISTER_ERROR_INTERNAL),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PostMapping("/token")
    public ResponseEntity<JwtResponse> token(@RequestBody RefreshJwtRequest jwtRequest) throws AuthException {
        return ResponseEntity.ok(authService.token(jwtRequest.getToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(@RequestBody RefreshJwtRequest jwtRequest) throws AuthException {
        return ResponseEntity.ok(authService.refresh(jwtRequest.getToken()));
    }

    private static final String REGISTER_ERROR_INTERNAL = "Failed to register, try again later";

    @PostMapping(value = "/register", produces = "application/json")
    public ResponseEntity<AuthenticateResponseDto> register(
            @RequestBody RegisterUserRequestDto registerUserRequestDto
    ) {
        String username = registerUserRequestDto.getUsername();
        String password = registerUserRequestDto.getPassword();

        try {
            authService.registerUser(username, password);
        } catch (InvalidCredentialsException e) {
            return new ResponseEntity<>(
                    new AuthenticateResponseDto(e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new AuthenticateResponseDto(REGISTER_ERROR_INTERNAL),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        JwtRequest jwtRequest = new JwtRequest(username, password);
        JwtResponse jwtResponse = authService.login(jwtRequest);
        UserDto user = userService.getByUsername(username).get();
        return new ResponseEntity<>(
                new AuthenticateResponseDto(user, jwtResponse), HttpStatus.CREATED);
    }
}
