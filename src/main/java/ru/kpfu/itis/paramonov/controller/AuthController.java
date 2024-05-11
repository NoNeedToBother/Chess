package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.paramonov.dto.auth.RegisterUserResponse;
import ru.kpfu.itis.paramonov.dto.auth.JwtRequest;
import ru.kpfu.itis.paramonov.dto.auth.JwtResponse;
import ru.kpfu.itis.paramonov.dto.auth.RefreshJwtRequest;
import ru.kpfu.itis.paramonov.dto.request.RegisterUserRequestDto;
import ru.kpfu.itis.paramonov.exceptions.InvalidCredentialsException;
import ru.kpfu.itis.paramonov.service.AuthService;

import javax.security.auth.message.AuthException;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest jwtRequest) {
        return ResponseEntity.ok(authService.login(jwtRequest));
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
    public ResponseEntity<RegisterUserResponse> register(
            @RequestBody RegisterUserRequestDto registerUserRequestDto
    ) {
        String username = registerUserRequestDto.getUsername();
        String password = registerUserRequestDto.getPassword();

        try {
            authService.registerUser(username, password);
        } catch (InvalidCredentialsException e) {
            return new ResponseEntity<>(
                    new RegisterUserResponse(e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new RegisterUserResponse(REGISTER_ERROR_INTERNAL),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        JwtRequest jwtRequest = new JwtRequest(username, password);
        return new ResponseEntity<>(
                new RegisterUserResponse(authService.login(jwtRequest)),
                HttpStatus.CREATED);
    }
}
