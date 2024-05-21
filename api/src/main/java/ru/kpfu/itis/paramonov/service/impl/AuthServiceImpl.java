package ru.kpfu.itis.paramonov.service.impl;

import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.paramonov.service.AuthService;
import ru.kpfu.itis.paramonov.dto.auth.JwtRequest;
import ru.kpfu.itis.paramonov.dto.auth.JwtResponse;
import ru.kpfu.itis.paramonov.exceptions.InvalidCredentialsException;
import ru.kpfu.itis.paramonov.filter.jwt.JwtProvider;
import ru.kpfu.itis.paramonov.model.Role;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.UserRepository;

import javax.security.auth.message.AuthException;

import java.util.*;

import static ru.kpfu.itis.paramonov.utils.ExceptionMessages.*;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final UserRepository userRepository;
    private Map<String, String> refreshStorage = new HashMap<>();
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;


    @Override
    public JwtResponse login(JwtRequest request) {
        checkUsernameAndPassword(request.getUsername(), request.getPassword());
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException(INCORRECT_CREDENTIALS_ERROR));
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String accessToken = jwtProvider.generateAccessToken(user);
            String refreshToken = jwtProvider.generateRefreshToken(user);
            refreshStorage.put(user.getUsername(), refreshToken);
            return new JwtResponse(accessToken, refreshToken);
        } else {
            throw new InvalidCredentialsException(INCORRECT_CREDENTIALS_ERROR);
        }
    }

    @Override
    public JwtResponse refresh(String refreshToken) throws AuthException {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            String username = claims.getSubject();
            String savedRefresh = refreshStorage.get(username);
            if (savedRefresh != null && savedRefresh.equals(refreshToken)) {
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new AuthException(username));
                String accessToken = jwtProvider.generateAccessToken(user);
                String newRefreshToken = jwtProvider.generateRefreshToken(user);
                refreshStorage.put(user.getUsername(), newRefreshToken);
                return new JwtResponse(accessToken, newRefreshToken);
            }
        }
        throw new AuthException(INVALID_REFRESH_TOKEN_ERROR);
    }

    @Override
    public JwtResponse token(String refreshToken) throws AuthException {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            String username = claims.getSubject();
            String savedRefresh = refreshStorage.get(username);

            if (savedRefresh != null && savedRefresh.equals(refreshToken)) {
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new AuthException(username));
                String accessToken = jwtProvider.generateAccessToken(user);
                return new JwtResponse(accessToken, null);
            }
        }
        throw new AuthException(INVALID_REFRESH_TOKEN_ERROR);
    }

    @Override
    public void registerUser(String username, String password) {
        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER);
        checkUsernameAndPassword(username, password);

        ValidationResult usernameValidation = validateUsername(username);
        if (!usernameValidation.result)
            throw new InvalidCredentialsException(usernameValidation.error);
        ValidationResult passwordValidation = validatePassword(password);
        if (!passwordValidation.result)
            throw new InvalidCredentialsException(passwordValidation.error);
        Optional<User> optional = userRepository.findByUsername(username);
        if (optional.isPresent()) throw new InvalidCredentialsException(NON_UNIQUE_USERNAME_ERROR);

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .roles(roles)
                .build();
        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    private ValidationResult validateUsername(String username) {
        boolean check = username.length() >= 6;
        if (check) {
            return new ValidationResult(true);
        } else return new ValidationResult(false, SHORT_USERNAME_ERROR);
    }

    private ValidationResult validatePassword(String password) {
        boolean lengthCheck = password.length() >= 8;
        if (!lengthCheck) {
            return new ValidationResult(false, SHORT_PASSWORD_ERROR);
        }
        boolean hasDigit = false;
        boolean hasLowerCase = false;
        boolean hasUpperCase = false;
        for (Character c : password.toCharArray()) {
            if (Character.isDigit(c)) hasDigit = true;
            if (Character.isLowerCase(c)) hasLowerCase = true;
            if (Character.isUpperCase(c)) hasUpperCase = true;
        }
        if (hasDigit && hasLowerCase && hasUpperCase) {
            return new ValidationResult(true);
        } else return new ValidationResult(false, INVALID_PASSWORD_ERROR);
    }

    private void checkUsernameAndPassword(String username, String password) {
        if (username == null || password == null || username.isEmpty() || password.isEmpty())
            throw new InvalidCredentialsException(EMPTY_CREDENTIALS_ERROR);
    }

    @AllArgsConstructor
    @RequiredArgsConstructor
    private static class ValidationResult {
        private final boolean result;

        private String error;
    }
}