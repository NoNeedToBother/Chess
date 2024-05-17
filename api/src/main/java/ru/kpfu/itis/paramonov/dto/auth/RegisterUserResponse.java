package ru.kpfu.itis.paramonov.dto.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.kpfu.itis.paramonov.dto.response.BaseResponseDto;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterUserResponse extends BaseResponseDto {

    @JsonProperty("jwtInfo")
    private JwtResponse jwtInfo;

    public RegisterUserResponse(JwtResponse jwtInfo) {
        this.jwtInfo = jwtInfo;
        this.error = null;
    }

    public RegisterUserResponse(String error) {
        this.error = error;
        this.jwtInfo = null;
    }
}
