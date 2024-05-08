package ru.kpfu.itis.paramonov.service;



import ru.kpfu.itis.paramonov.dto.jwt.JwtRequest;
import ru.kpfu.itis.paramonov.dto.jwt.JwtResponse;

import javax.security.auth.message.AuthException;

public interface AuthService {

    JwtResponse login(JwtRequest request);
    JwtResponse token(String request) throws AuthException;
    JwtResponse refresh(String request) throws AuthException;
}
