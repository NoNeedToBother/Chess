package ru.kpfu.itis.paramonov.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import ru.kpfu.itis.paramonov.dto.users.UserDto;
import ru.kpfu.itis.paramonov.dto.social.PostDto;

@AllArgsConstructor
public class PostResponseDto extends BaseResponseDto {

    @JsonProperty("author")
    private UserDto user;

    @JsonProperty("post")
    private PostDto post;

}
