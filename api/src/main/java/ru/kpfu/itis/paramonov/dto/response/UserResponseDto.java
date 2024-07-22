package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.kpfu.itis.paramonov.dto.users.BanDto;
import ru.kpfu.itis.paramonov.dto.users.UserDto;

public class UserResponseDto extends BaseResponseDto{

    @JsonProperty("user")
    private UserDto user;

    @JsonProperty("isLiked")
    private Boolean isLiked;

    @JsonProperty("ban")
    private BanDto ban;

    public UserResponseDto(UserDto user, boolean isLiked) {
        this.user = user;
        this.isLiked = isLiked;
    }

    public UserResponseDto(UserDto user, boolean isLiked, BanDto ban) {
        this.user = user;
        this.isLiked = isLiked;
        this.ban = ban;
    }
}
