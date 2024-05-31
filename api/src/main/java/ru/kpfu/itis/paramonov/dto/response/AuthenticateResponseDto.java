package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.dto.auth.JwtResponse;

@AllArgsConstructor
public class AuthenticateResponseDto extends BaseResponseDto{

    @JsonProperty("user")
    private UserDto user;

    @JsonProperty("jwtInfo")
    private JwtResponse jwtInfo;

    public AuthenticateResponseDto(String error) {
        super(error);
    }
}
