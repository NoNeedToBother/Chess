package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.kpfu.itis.paramonov.dto.UserDto;

public class UserResponseDto extends BaseResponseDto{

    @JsonProperty("user")
    private UserDto user;

    @JsonProperty("isLiked")
    private Boolean isLiked;

    @JsonProperty("isBanned")
    private Boolean isBanned;

    public UserResponseDto(UserDto user, boolean isLiked, boolean isBanned) {
        this.user = user;
        this.isLiked = isLiked;
        this.isBanned = isBanned;
    }
    public UserResponseDto(String error) {
        super(error);
    }
}
