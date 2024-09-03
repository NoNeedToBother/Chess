package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UpdateProfilePictureResponseDto extends BaseResponseDto {
    @JsonProperty("url")
    private String url;
}
