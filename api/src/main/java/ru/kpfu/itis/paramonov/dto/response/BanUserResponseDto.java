package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class BanUserResponseDto extends BaseResponseDto {

    @JsonProperty("userData")
    private UserResponseDto userResponseDto;
}
