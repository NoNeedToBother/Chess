package ru.kpfu.itis.paramonov.service;



import ru.kpfu.itis.paramonov.dto.auth.JwtResponse;

import javax.security.auth.message.AuthException;

public interface AuthService {

    JwtResponse login(String username, String password);

    JwtResponse token(String request) throws AuthException;

    JwtResponse refresh(String request) throws AuthException;

    void registerUser(String username, String password);
}
