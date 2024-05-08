package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.paramonov.dto.jwt.JwtRequest;
import ru.kpfu.itis.paramonov.dto.jwt.JwtResponse;
import ru.kpfu.itis.paramonov.dto.jwt.RefreshJwtRequest;
import ru.kpfu.itis.paramonov.dto.request.RegisterUserRequestDto;
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

    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(
            @RequestBody RegisterUserRequestDto registerUserRequestDto
    ) {
        String username = registerUserRequestDto.getUsername();
        String password = registerUserRequestDto.getPassword();

        userService.registerUser(
                registerUserRequestDto.getUsername(),
                registerUserRequestDto.getPassword()
        );

        JwtRequest jwtRequest = new JwtRequest(username, password);
        return login(jwtRequest);
    }
}
