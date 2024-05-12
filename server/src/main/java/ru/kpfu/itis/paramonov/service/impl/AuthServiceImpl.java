package ru.kpfu.itis.paramonov.service.impl;

import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kpfu.itis.paramonov.service.AuthService;
import ru.kpfu.itis.paramonov.dto.auth.JwtRequest;
import ru.kpfu.itis.paramonov.dto.auth.JwtResponse;
import ru.kpfu.itis.paramonov.exceptions.InvalidCredentialsException;
import ru.kpfu.itis.paramonov.filter.JwtProvider;
import ru.kpfu.itis.paramonov.model.Role;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.UserRepository;

import javax.security.auth.message.AuthException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final UserRepository userRepository;
    private Map<String, String> refreshStorage = new HashMap<>();
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;


    @Override
    public JwtResponse login(JwtRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(request.getUsername()));
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String accessToken = jwtProvider.generateAccessToken(user);
            String refreshToken = jwtProvider.generateRefreshToken(user);
            refreshStorage.put(user.getUsername(), refreshToken);
            return new JwtResponse(accessToken, refreshToken);
        }
        return null;
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
        throw new AuthException("Invalid refresh token");
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
        throw new AuthException("Invalid refresh token");
    }

    private final static String EMPTY_CREDENTIALS_ERROR = "Credentials must be not empty";

    private final static String NON_UNIQUE_USERNAME_ERROR = "This username already belongs to other user";

    @Override
    public void registerUser(String username, String password) {
        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER);
        if (username == null || password == null || username.isEmpty() || password.isEmpty())
            throw new InvalidCredentialsException(EMPTY_CREDENTIALS_ERROR);

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

    private final static String SHORT_USERNAME_ERROR = "Username length should be at least 6 characters";

    private final static String SHORT_PASSWORD_ERROR = "Password length should be at least 8 characters";

    private final static String INVALID_PASSWORD_ERROR = "Password should have at least one of each:" +
            " uppercase, lowercase and digit character";

    @AllArgsConstructor
    @RequiredArgsConstructor
    private static class ValidationResult {
        private final boolean result;

        private String error;
    }
}