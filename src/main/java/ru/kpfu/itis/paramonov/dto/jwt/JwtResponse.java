package ru.kpfu.itis.paramonov.dto.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class JwtResponse {

    private String accessToken;
    private String refreshToken;
}
