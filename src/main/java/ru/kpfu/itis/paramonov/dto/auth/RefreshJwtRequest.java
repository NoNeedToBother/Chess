package ru.kpfu.itis.paramonov.dto.auth;

import lombok.Getter;

@Getter
public class RefreshJwtRequest {
    private String token;
}
